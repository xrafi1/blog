document.addEventListener('DOMContentLoaded', async () => {
  // Fetch and display existing posts
  const response = await fetch('/api/posts');
  const posts = await response.json();

  const postsContainer = document.getElementById('posts');
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

  // Handle form submission
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

async function deletePost(id) {
  await fetch(`/api/posts/${id}`, { method: 'DELETE' });
  window.location.reload();
}