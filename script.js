document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/api/posts');
  const posts = await response.json();

  const postsContainer = document.getElementById('posts');
  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post-card';
    postElement.innerHTML = `
      <img src="${post.image || '/placeholder.jpg'}" alt="${post.title}">
      <h2>${post.title}</h2>
      <p>${post.content.substring(0, 100)}...</p>
      <a href="/post.html?id=${post._id}" class="text-blue-600 hover:underline m-4 inline-block">Read More</a>
    `;
    postsContainer.appendChild(postElement);
  });
});