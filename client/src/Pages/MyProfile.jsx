import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; 

export default function MyProfile() {
  const { token, user } = useAuth(); // userId, token
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    github: "",
    website: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // state edit mode toggle 

  // ✅ Fetch profile + blogs
  useEffect(() => {
    if (!user?._id) return;
    axios
      .get(`https://bloging-platform.onrender.com/api/blog/user/${user._id}`)
      .then((res) => {
        setProfile(res.data.userProfile);
        setBlogs(res.data.blogs);

        setFormData({
          name: res.data.userProfile.name || "",
          username: res.data.userProfile.username || "",
          bio: res.data.userProfile.bio || "",
          twitter: res.data.userProfile.socialLinks?.twitter || "",
          linkedin: res.data.userProfile.socialLinks?.linkedin || "",
          instagram: res.data.userProfile.socialLinks?.instagram || "",
          github: res.data.userProfile.socialLinks?.github || "",
          website: res.data.userProfile.socialLinks?.website || "",
        });
      })
      .catch((err) => console.error(err));
  }, [user]);

  // ✅ Handle file upload preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ Handle update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("username", formData.username);
      data.append("bio", formData.bio);
      data.append(
        "socialLinks",
        JSON.stringify({
          twitter: formData.twitter,
          linkedin: formData.linkedin,
          instagram: formData.instagram,
          github: formData.github,
          website: formData.website,
        })
      );
      if (profilePhoto) data.append("profilePhoto", profilePhoto);

      const res = await axios.put(
        `https://bloging-platform.onrender.com/api/blog/user/update/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile(res.data.user);
      setIsEditing(false); // ✅ update ke baad form band ho jaye
      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6 flex flex-col md:flex-row items-center gap-6">
        <img
          src={preview || profile.profilePhoto}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <p className="text-gray-600">@{profile.username}</p>
          <p className="mt-2 text-gray-700">{profile.bio}</p>
          <div className="flex gap-3 mt-3 text-blue-600 flex-wrap">
            {profile.socialLinks?.twitter && (
              <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer">
                Twitter
              </a>
            )}
            {profile.socialLinks?.linkedin && (
              <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}
            {profile.socialLinks?.instagram && (
              <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            )}
            {profile.socialLinks?.github && (
              <a href={profile.socialLinks.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            )}
            {profile.socialLinks?.website && (
              <a href={profile.socialLinks.website} target="_blank" rel="noreferrer">
                Website
              </a>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Update Form (only when editing) */}
      {isEditing && (
        <form
          onSubmit={handleUpdate}
          className="bg-white shadow-md rounded-xl p-6 mb-6"
        >
          <h3 className="text-xl font-semibold mb-4">Update Profile</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="p-2 border rounded-lg w-full"
            />
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="p-2 border rounded-lg w-full"
            />
          </div>

          <textarea
            placeholder="Bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="p-2 border rounded-lg w-full mt-4"
          />

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <input
              type="url"
              placeholder="Twitter"
              value={formData.twitter}
              onChange={(e) =>
                setFormData({ ...formData, twitter: e.target.value })
              }
              className="p-2 border rounded-lg w-full"
            />
            <input
              type="url"
              placeholder="LinkedIn"
              value={formData.linkedin}
              onChange={(e) =>
                setFormData({ ...formData, linkedin: e.target.value })
              }
              className="p-2 border rounded-lg w-full"
            />
            <input
              type="url"
              placeholder="Instagram"
              value={formData.instagram}
              onChange={(e) =>
                setFormData({ ...formData, instagram: e.target.value })
              }
              className="p-2 border rounded-lg w-full"
            />
            <input
              type="url"
              placeholder="GitHub"
              value={formData.github}
              onChange={(e) =>
                setFormData({ ...formData, github: e.target.value })
              }
              className="p-2 border rounded-lg w-full"
            />
            <input
              type="url"
              placeholder="Website"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="p-2 border rounded-lg w-full"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      )}

      {/* User Blogs */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">My Blogs</h3>
        {blogs.length === 0 ? (
          <p className="text-gray-500">No blogs yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="p-4 border rounded-lg hover:shadow-md transition"
              >
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                )}
                <h4 className="font-bold text-lg">{blog.title}</h4>
                <p className="text-gray-600 line-clamp-3">{blog.content}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
