import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  return (
    <article className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden flex flex-col">
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-64 sm:h-72 lg:h-80 object-cover object-center"
        />
      )}

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">
          {blog.title}
        </h3>

        <p className="text-gray-600 text-sm sm:text-base line-clamp-3 flex-grow">
          {blog.content}
        </p>

        <div className="flex items-center justify-between mt-3 text-xs sm:text-sm text-gray-500">
          <span>By {blog.author?.username || "Unknown"}</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <Link
            to={`/blog/${blog._id}`}
            className="px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-black text-sm sm:text-base"
          >
            Read More
          </Link>
          <div className="text-xs sm:text-sm text-gray-500">
            ❤️ {blog.likes?.length || 0} • 💬 {blog.comments?.length || 0}
          </div>
        </div>
      </div>
    </article>
  );
}
