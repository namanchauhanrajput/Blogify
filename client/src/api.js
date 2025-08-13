const BASE_URL = "https://bloging-platform.onrender.com";

export const endpoints = {
  blogs: `${BASE_URL}/api/blog`,
  blog: (id) => `${BASE_URL}/api/blog/${id}`,
  like: (id) => `${BASE_URL}/api/blog/like/${id}`,
  comment: (id) => `${BASE_URL}/api/blog/comment/${id}`,
  comments: (id) => `${BASE_URL}/api/blog/comments/${id}`,
};

export const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});
