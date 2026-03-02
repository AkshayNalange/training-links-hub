// api/posts.js — Vercel Postgres version
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // Create table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                link TEXT NOT NULL,
                category TEXT NOT NULL,
                tags TEXT[],
                created_at TIMESTAMP DEFAULT NOW()
            )
        `;

        // GET all posts
        if (req.method === 'GET') {
            const { rows } = await sql`
                SELECT * FROM posts ORDER BY created_at DESC
            `;
            return res.status(200).json(rows);
        }

        // POST new post
        if (req.method === 'POST') {
            const { title, description, link, category, tags } = req.body;

            if (!title || !description || !link || !category || !tags) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const tagsArray = Array.isArray(tags) 
                ? tags 
                : tags.split(',').map(t => t.trim());

            const { rows } = await sql`
                INSERT INTO posts (title, description, link, category, tags)
                VALUES (${title}, ${description}, ${link}, ${category}, ${tagsArray})
                RETURNING *
            `;
            return res.status(201).json(rows[0]);
        }

        // DELETE post
        if (req.method === 'DELETE') {
            const id = req.url.split('/').pop();
            await sql`DELETE FROM posts WHERE id = ${id}`;
            return res.status(200).json({ message: 'Deleted' });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('DB Error:', error);
        return res.status(500).json({ error: 'Database error', detail: error.message });
    }
}
