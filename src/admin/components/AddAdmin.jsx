import React, { useState } from 'react';
import { supabase } from '../../services/supabase';
import { UserPlus, Search, ShieldCheck, Loader2 } from 'lucide-react';

export default function AddAdmin() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handlePromote = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // 1. البحث عن اليوزر بالإيميل
      const { data: userProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, first_name, role')
        .eq('email', email)
        .single();

      if (fetchError || !userProfile) throw new Error('User not found. Make sure they signed up first.');
      if (userProfile.role === 'admin') throw new Error('This user is already an admin!');

      // 2. تحديث الرول لـ admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userProfile.id);

      if (updateError) throw updateError;

      setMessage({ type: 'success', text: `Success! ${userProfile.first_name} is now an admin.` });
      setEmail('');
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border-t-4 border-blue-600">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
          <UserPlus size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Add New Admin</h2>
      </div>

      <p className="text-gray-500 mb-6 text-sm">
        Enter the email address of a registered user to grant them administrative privileges.
      </p>

      <form onSubmit={handlePromote} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="User Email (e.g., friend@example.com)"
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
          PROMOTE TO ADMIN
        </button>
      </form>

      {message.text && (
        <div className={`mt-4 p-4 rounded-md text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
}