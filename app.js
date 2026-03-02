const API_URL = '/api/posts';
let allPosts = [];
let filteredPosts = [];
let selectedTags = [];

// Load posts from API
async function loadPosts() {
    showLoadingSpinner(true);
    try {
        const response = await fetch(API_URL);
        allPosts = await response.json();
        filteredPosts = [...allPosts];
        renderPosts(filteredPosts);
    } catch (error) {
        console.error('Error loading posts:', error);
        document.getElementById('emptyState').style.display = 'block';
    } finally {
        showLoadingSpinner(false);
    }
}

// Render posts
function renderPosts(posts) {
    const grid = document.getElementById('postsGrid');
    const empty = document.getElementById('emptyState');

    if (posts.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    grid.innerHTML = posts.map((post, idx) => `
        <div class="post-card" style="animation-delay: ${idx * 0.1}s">
            <div class="post-header">
                <div class="category-badge">${post.category}</div>
            </div>
            <div class="post-content">
                <h3 class="post-title">${post.title}</h3>
                <p class="post-description">${post.description}</p>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="post-footer">
                <a href="${post.link}" target="_blank" class="post-link">View</a>
            </div>
        </div>
    `).join('');
}

// Initialize filters
function initializeFilters() {
    const categories = [...new Set(allPosts.map(p => p.category))];
    const filterDiv = document.getElementById('tagFilter');
    
    filterDiv.innerHTML = categories.map(cat => `
        <button class="tag-btn" onclick="toggleTag('${cat}')">${cat}</button>
    `).join('');
}

// Toggle tag filter
function toggleTag(tag) {
    const btn = event.target;
    
    if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter(t => t !== tag);
        btn.classList.remove('active');
    } else {
        selectedTags.push(tag);
        btn.classList.add('active');
    }
    
    filterPosts();
}

// Filter posts
function filterPosts() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    
    filteredPosts = allPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchText) || 
                             post.description.toLowerCase().includes(searchText) ||
                             post.tags.some(tag => tag.toLowerCase().includes(searchText));
        
        const matchesCategory = selectedTags.length === 0 || selectedTags.includes(post.category);
        
        return matchesSearch && matchesCategory;
    });
    
    renderPosts(filteredPosts);
}

// Add post (Admin)
async function addPost(post) {
    showLoadingSpinner(true);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post)
        });
        
        if (response.ok) {
            alert('Post added successfully!');
            document.getElementById('postForm').reset();
            loadAdminPosts();
        } else {
            alert('Error adding post');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding post');
    } finally {
        showLoadingSpinner(false);
    }
}

// Delete post (Admin)
async function deletePost(id) {
    if (!confirm('Are you sure?')) return;
    
    showLoadingSpinner(true);
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        
        if (response.ok) {
            alert('Post deleted!');
            loadAdminPosts();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting post');
    } finally {
        showLoadingSpinner(false);
    }
}

// Loading spinner
function showLoadingSpinner(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.add('active');
    } else {
        spinner.classList.remove('active');
    }
}
