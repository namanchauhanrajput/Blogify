import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  return (
    <article className="bg-white rounded-2xl transition duration-300 overflow-hidden flex flex-col  h-full">
      {/* ✅ Username Clickable */}
      <div className="flex items-center justify-between mt-3 text-xs sm:text-sm text-gray-500">
        <Link 
          to={`/profile/${blog.author?._id}`} 
          className="hover:underline text-blue-600"
        >
          By {blog.author?.username || "Unknown"}
        </Link>
      </div>

      {blog.image && (
        <div className="w-full">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full  object-cover object-center"
          />
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">
          {blog.title}
        </h3>

        {/* Content */}
        <p className="text-gray-600 text-sm sm:text-base line-clamp-3 flex-grow">
          {blog.content}
        </p>

        {/* Date */}
        <div className="flex items-center justify-between mt-3 text-xs sm:text-sm text-gray-500">
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Actions */}
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
