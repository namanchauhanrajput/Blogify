// src/Pages/SearchUsers.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";

const API_URL = "http://localhost:5000"; // 🔑 backend base URL

export default function SearchUsers() {
  const { token } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Live search with debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_URL}/api/users/search?username=${query}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setResults(res.data);
      } catch (err) {
        console.error("Error searching users:", err);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [query, token]);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-12">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
         Search Users
      </h1>

      {/* Search Bar */}
      <div className="flex items-center gap-3 mb-10 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-3 shadow-sm">
        <Search className="text-gray-500" size={22} />
        <input
          type="text"
          placeholder="Type a username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 text-base"
        />
        {loading && <Loader2 className="animate-spin text-gray-500" size={22} />}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {query.trim().length < 2 ? (
          <p className="text-center text-gray-500 italic">
            Start typing to search users...
          </p>
        ) : loading ? (
          <p className="text-center text-gray-500 italic">Searching...</p>
        ) : results.length > 0 ? (
          results.map((user) => (
            <div
              key={user._id}
              onClick={() => navigate(`/profile/${user._id}`)}
              className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-md cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <img
                src={
                  user.profilePhoto ||
                  "https://via.placeholder.com/40x40.png?text=User"
                }
                alt={user.username}
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">No users found.</p>
        )}
      </div>
    </div>
  );
}
