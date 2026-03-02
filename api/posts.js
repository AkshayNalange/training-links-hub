// For demo: stores data in memory (resets on redeploy)
// For production: use MongoDB or Supabase

let posts = [
    {
        _id: '1',
        title: 'React Complete Guide',
        description: 'Learn React from basics to advanced concepts',
        link: 'https://react.dev',
        category: 'Web Development',
        tags: ['React', 'JavaScript', 'Tutorial']
    },
    {
        _id: '2',
        title: 'Python Data Science',
        description: 'Master data science with Python',
        link: 'https://www.python.org',
        category: 'Data Science',
        tags: ['Python', 'Data Science', 'ML']
    }
];

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // GET all posts
    if (req.method === 'GET') {
        return res.status(200).json(posts);
    }

    // POST new post
    if (req.method === 'POST') {
        const { title, description, link, category, tags } = req.body;
        
        if (!title || !description || !link || !category || !tags) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newPost = {
            _id: Date.now().toString(),
            title,
            description,
            link,
            category,
            tags: Array.isArray(tags) ? tags : [tags],
            createdAt: new Date().toISOString()
        };

        posts.unshift(newPost);
        return res.status(201).json(newPost);
    }

    // DELETE post
    if (req.method === 'DELETE') {
        const { id } = req.query;
        posts = posts.filter(p => p._id !== id);
        return res.status(200).json({ message: 'Deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
```

---

#### **FILE 7: `.gitignore`**
```
node_modules/
.env
.env.local
.vercel/
.DS_Store
