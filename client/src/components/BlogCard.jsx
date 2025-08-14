
import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  return (
    <article className="bg-white rounded-2xl shadow p-4 hover:shadow-md transition">
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-56 object-cover rounded-xl mb-3"
        />
      )}
      <h3 className="text-xl font-semibold mb-1">{blog.title}</h3>
      <p className="text-gray-600 line-clamp-3">{blog.content}</p>

      <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
        <span>By { blog.author?.username || "Unknown"}</span>
        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="flex items-center justify-between mt-4">
        <Link
          to={`/blog/${blog._id}`}
          className="px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-black"
        >
          Read More
        </Link>
        <div className="text-sm text-gray-500">
          ❤️ {blog.likes?.length || 0} • 💬 {blog.comments?.length || 0}
        </div>
      </div>
    </article>
  );
}
