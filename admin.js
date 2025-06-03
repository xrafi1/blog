document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is authenticated
  const authResponse = await fetch('/api/auth/check');
  const authStatus = await authResponse.json();

  if (authStatus.authenticated) {
    document.getElementById('login').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    loadPosts();
  }

  // Handle login form submission
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      document.getElementById('login').classList.add('hidden');
      document.getElementById('adminPanel').classList.remove('hidden');
      loadPosts();
    } else {
      alert('Invalid username or password');
    }
  });

  // Handle post form submission
  document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('content', document.getElementById('content').value);
    formData.append('image', document.getElementById('image').files[0]);

    await fetch('/api/posts', {
      method: 'POST',
      body: formData
    });

    window.location.reload();
  });
});

async function loadPosts() {
  const response = await fetch('/api/posts');
  const posts = await response.json();

  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = '';
  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post-item';
    postElement.innerHTML = `
      <h3 class="text-xl font-bold">${post.title}</h3>
      <p>${post.content.substring(0, 100)}...</p>
      <button onclick="deletePost('${post._id}')" class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Delete</button>
    `;
    postsContainer.appendChild(postElement);
  });
}

async function deletePost(id) {
  await fetch(`/api/posts/${id}`, { method: 'DELETE' });
  window.location.reload();
}
