const BASE_URL = "https://bloging-platform.onrender.com";

export const endpoints = {
  // ✅ Blog CRUD
  blogs: `${BASE_URL}/api/blog`, // GET all, POST new
  getBlog: (id) => `${BASE_URL}/api/blog/${id}`, // GET single
  createBlog: `${BASE_URL}/api/blog`, // POST new blog
  updateBlog: (id) => `${BASE_URL}/api/blog/${id}`, // PUT update
  deleteBlog: (id) => `${BASE_URL}/api/blog/${id}`, // DELETE blog

  // ✅ Like system
  like: (id) => `${BASE_URL}/api/blog/like/${id}`,

  // ✅ Comment system
  comment: (id) => `${BASE_URL}/api/blog/comment/${id}`, // POST single
  comments: (id) => `${BASE_URL}/api/blog/comments/${id}`, // GET all
};

export const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});
