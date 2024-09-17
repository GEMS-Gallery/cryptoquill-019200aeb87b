import { backend } from 'declarations/backend';

let quill;

const newPostBtn = document.getElementById('newPostBtn');
const postForm = document.getElementById('postForm');

newPostBtn.addEventListener('click', () => {
    console.log('New Post button clicked'); // Add this line for debugging
    postForm.style.display = postForm.style.display === 'none' ? 'block' : 'none';
});

document.addEventListener('DOMContentLoaded', async function() {
    quill = new Quill('#editor', {
        theme: 'snow'
    });

    const blogPostForm = document.getElementById('blogPostForm');

    blogPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('postTitle').value;
        const author = document.getElementById('postAuthor').value;
        const body = quill.root.innerHTML;

        await backend.addPost(title, body, author);
        blogPostForm.reset();
        quill.setContents([]);
        postForm.style.display = 'none';
        await loadPosts();
    });

    await loadPosts();
});

async function loadPosts() {
    const posts = await backend.getPosts();
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';

    posts.sort((a, b) => b.timestamp - a.timestamp).forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <div class="post-meta">By ${post.author} on ${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</div>
            <div class="post-body">${post.body}</div>
        `;
        postsContainer.appendChild(postElement);
    });
}
