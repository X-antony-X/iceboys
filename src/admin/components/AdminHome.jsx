import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Tags, 
  Layers, 
  Package, 
  UserPlus,
  Image as ImageIcon,
  LogOut 
} from 'lucide-react';
import { supabase } from '../../services/supabase';

export default function AdminHome() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/signin');
  };

  const adminActions = [
    { title: 'Manage Products', icon: <Package size={24} />, path: '/manage-products', color: 'bg-blue-500' },
    { title: 'Add New Product', icon: <PlusCircle size={24} />, path: '/add', color: 'bg-green-500' },
    { title: 'Categories', icon: <Tags size={24} />, path: '/categories', color: 'bg-purple-500' },
    { title: 'Collections', icon: <Layers size={24} />, path: '/add-collection', color: 'bg-orange-500' },
    { title: 'Hero Section', icon: <ImageIcon size={24} />, path: '/admin-hero', color: 'bg-pink-500' },
    { title: 'Add Admin', icon: <UserPlus size={24} />, path: '/add-admin', color: 'bg-indigo-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar بسيط */}
      <div className="w-64 bg-[#004b93] text-white p-6 hidden md:block">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-10">Ice Boys Admin</h2>
        <nav className="space-y-4">
          <Link to="/admin-home" className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-sm transition">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 p-2 hover:bg-red-500 rounded-sm transition w-full mt-auto text-left">
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Control Panel</h1>
          <button onClick={handleLogout} className="md:hidden text-red-600"><LogOut /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminActions.map((action, index) => (
            <Link 
              key={index} 
              to={action.path}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all group"
            >
              <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-700">{action.title}</h3>
              <p className="text-gray-500 text-sm mt-1">Manage and update your store's {action.title.toLowerCase()}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}