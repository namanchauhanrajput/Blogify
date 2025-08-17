import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API_URL = "https://bloging-platform.onrender.com";

const MyProfile = () => {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null); // ✅ for file upload

  const [form, setForm] = useState({
    name: "",
    username: "",
    bio: "",
    profilePhoto: "", // for URL
    socialLinks: {
      twitter: "",
      linkedin: "",
      instagram: "",
      github: "",
      website: "",
    },
  });

  // ✅ Fetch profile on load
  useEffect(() => {
    if (!user?._id) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/blog/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(res.data.userProfile);
        setBlogs(res.data.blogs || []);

        setForm({
          name: res.data.userProfile.name || "",
          username: res.data.userProfile.username || "",
          bio: res.data.userProfile.bio || "",
          profilePhoto: res.data.userProfile.profilePhoto || "",
          socialLinks: res.data.userProfile.socialLinks || {
            twitter: "",
            linkedin: "",
            instagram: "",
            github: "",
            website: "",
          },
        });
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, token]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["twitter", "linkedin", "instagram", "github", "website"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ File change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ✅ Update profile API
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("username", form.username);
      formData.append("bio", form.bio);

      // ✅ Agar file choose ki gayi hai to file bhejo, warna URL
      if (file) {
        formData.append("profilePhoto", file);
      } else if (form.profilePhoto) {
        formData.append("profilePhoto", form.profilePhoto);
      }

      // ✅ Social links ko append karo
      Object.keys(form.socialLinks).forEach((key) => {
        if (form.socialLinks[key]) {
          formData.append(`socialLinks[${key}]`, form.socialLinks[key]);
        }
      });

      const res = await axios.put(
        `${API_URL}/api/blog/user/update/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile(res.data.user);
      setEditMode(false);
      alert("Profile updated successfully ✅");
    } catch (error) {
      console.error("Update error:", error);
      alert(error.response?.data?.message || "Update failed ❌");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!profile) return <div className="text-center py-10">No profile found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-10 space-y-10">
      {/* Profile Info */}
      <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <img
            src={profile.profilePhoto}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2"
          />
          <div className="text-center sm:text-left">
            <p className="text-gray-600 text-sm sm:text-base">{profile.name}</p>
            <h2 className="text-xl sm:text-2xl font-bold">@{profile.username}</h2>
          </div>
        </div>

        {/* Bio */}
        <div>
          <p className="text-gray-700 text-sm sm:text-base">
            {profile.bio || "No bio added yet."}
          </p>
        </div>

        {/* Social Links */}
        <div>
          <ul className="flex flex-wrap gap-4 text-sm text-blue-600">
            {profile.socialLinks.twitter && (
              <li><a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer">Twitter</a></li>
            )}
            {profile.socialLinks.linkedin && (
              <li><a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
            )}
            {profile.socialLinks.instagram && (
              <li><a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
            )}
            {profile.socialLinks.github && (
              <li><a href={profile.socialLinks.github} target="_blank" rel="noreferrer">GitHub</a></li>
            )}
            {profile.socialLinks.website && (
              <li><a href={profile.socialLinks.website} target="_blank" rel="noreferrer">Website</a></li>
            )}
          </ul>
        </div>

        {/* Edit Button & Form */}
        <div>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Edit Profile
            </button>
          ) : (
            <div className="space-y-3">
              {/* Form Fields */}
              <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" />
              <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} className="w-full border p-2 rounded" />
              <textarea name="bio" placeholder="Bio" value={form.bio} onChange={handleChange} className="w-full border p-2 rounded" />

              {/* ✅ File upload + URL both */}
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border p-2 rounded" />
              <input type="text" name="profilePhoto" placeholder="Profile Photo URL" value={form.profilePhoto} onChange={handleChange} className="w-full border p-2 rounded" />

              {/* Social Links */}
              <input type="text" name="twitter" placeholder="Twitter" value={form.socialLinks.twitter} onChange={handleChange} className="w-full border p-2 rounded" />
              <input type="text" name="linkedin" placeholder="LinkedIn" value={form.socialLinks.linkedin} onChange={handleChange} className="w-full border p-2 rounded" />
              <input type="text" name="instagram" placeholder="Instagram" value={form.socialLinks.instagram} onChange={handleChange} className="w-full border p-2 rounded" />
              <input type="text" name="github" placeholder="GitHub" value={form.socialLinks.github} onChange={handleChange} className="w-full border p-2 rounded" />
              <input type="text" name="website" placeholder="Website" value={form.socialLinks.website} onChange={handleChange} className="w-full border p-2 rounded" />

              {/* Buttons */}
              <div className="flex gap-3">
                <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded-lg">Save</button>
                <button onClick={() => setEditMode(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Blogs Section */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold">My Blogs</h3>
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="border rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-lg">{blog.title}</h4>
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full max-h-60 object-cover rounded"
                  />
                )}
                <p className="text-gray-700 text-sm sm:text-base">{blog.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No blogs found.</p>
        )}
      </section>
    </div>
  );
};

export default MyProfile;
