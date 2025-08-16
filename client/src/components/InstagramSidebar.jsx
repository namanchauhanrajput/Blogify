// src/components/InstagramSidebar.jsx
import { Home, Search, Compass, PlayCircle, MessageSquare, Heart, PlusSquare, User } from "lucide-react";

const InstagramSidebar = () => {
  const menuItems = [
    { icon: <Home size={24} />, label: "Home" },
    { icon: <Search size={24} />, label: "Search" },
    { icon: <Compass size={24} />, label: "Explore" },
    { icon: <PlayCircle size={24} />, label: "Reels" },
    { icon: <MessageSquare size={24} />, label: "Messages" },
    { icon: <Heart size={24} />, label: "Notifications" },
    { icon: <PlusSquare size={24} />, label: "Create" },
    { icon: <User size={24} />, label: "Profile" },
  ];

  return (
    <div className="h-screen w-64 bg-black text-white flex flex-col border-r border-gray-800 p-4">
      <h1 className="text-2xl font-bold mb-8 px-2">Instagram</h1>
      <nav className="space-y-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="flex items-center space-x-4 px-2 py-2 rounded-lg hover:bg-gray-900 w-full transition"
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default InstagramSidebar;
