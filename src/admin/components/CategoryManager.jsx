import React, { useState } from 'react';
import { Plus, Trash2, Save, Layers, X, PlusCircle, Loader2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../services/supabase';

const CategoryManager = () => {
  const queryClient = useQueryClient();
  const [newMainName, setNewMainName] = useState('');
  const [subItems, setSubItems] = useState(['']);
  
  // حالة لتخزين النص اللي بيتكتب جوه "إضافة عنصر جديد" لكل كرت بشكل منفصل
  const [editInputs, setEditInputs] = useState({});

  // 1. جلب البيانات
  const { data: categories, isLoading } = useQuery({
    queryKey: ['header_categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('header_categories').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // 2. Mutation للتعديل (إضافة أو حذف عنصر من المصفوفة)
  const updateMutation = useMutation({
    mutationFn: async ({ id, updatedSubs }) => {
      const { error } = await supabase
        .from('header_categories')
        .update({ sub_items: updatedSubs })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(['header_categories']),
  });

  // 3. Mutation لإضافة قسم جديد بالكامل
  const addMutation = useMutation({
    mutationFn: async (payload) => {
      const { error } = await supabase.from('header_categories').insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['header_categories']);
      setNewMainName('');
      setSubItems(['']);
    },
  });

  // 4. Mutation لحذف قسم بالكامل
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('header_categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(['header_categories']),
  });

  // --- دوال التحكم داخل الكروت ---

  const handleAddSubToExisting = (id, currentSubs) => {
    const newItem = editInputs[id];
    if (!newItem || newItem.trim() === '') return;
    
    const updatedSubs = [...currentSubs, newItem.trim()];
    updateMutation.mutate({ id, updatedSubs });
    setEditInputs({ ...editInputs, [id]: '' }); // تصفير الإنبوت بتاع الكرت ده بس
  };

  const handleRemoveSubFromExisting = (id, currentSubs, indexToRemove) => {
    const updatedSubs = currentSubs.filter((_, index) => index !== indexToRemove);
    updateMutation.mutate({ id, updatedSubs });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <Layers className="text-[#004b93]" size={32} />
          <h1 className="text-2xl font-black text-[#004b93] uppercase tracking-tighter">Header Menu Manager</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* فورم إضافة كوليكشن جديد */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Create New Group</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              addMutation.mutate({ main_name: newMainName, sub_items: subItems.filter(s => s !== '') });
            }} className="space-y-4">
              <input 
                type="text" value={newMainName} onChange={(e) => setNewMainName(e.target.value)}
                placeholder="Group Name (e.g. Winter)"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004b93] outline-none"
              />
              <button type="submit" className="w-full bg-[#004b93] text-white py-3 rounded-lg font-bold text-xs uppercase shadow-md hover:bg-blue-800 transition-all">
                Save New Group
              </button>
            </form>
          </div>

          {/* عرض الكروت والتحكم في العناصر */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? <p>Loading...</p> : categories?.map((cat) => (
              <div key={cat.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
                
                {/* زر حذف الكوليكشن بالكامل */}
                <button onClick={() => { if(window.confirm('Delete entire group?')) deleteMutation.mutate(cat.id) }} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>

                <h3 className="text-lg font-black text-[#004b93] mb-4 uppercase tracking-tight border-b pb-2">{cat.main_name}</h3>
                
                {/* قائمة العناصر الفرعية */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {cat.sub_items.map((sub, i) => (
                    <div key={i} className="group flex items-center gap-1 px-3 py-1 bg-blue-50 text-[#004b93] text-xs font-bold rounded-lg border border-blue-100">
                      {sub}
                      <button onClick={() => handleRemoveSubFromExisting(cat.id, cat.sub_items, i)} className="hover:text-red-500 ml-1">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {cat.sub_items.length === 0 && <p className="text-gray-400 text-xs italic">No items yet.</p>}
                </div>

                {/* فورم إضافة عنصر جديد جوه الكرت ده */}
                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
                  <input 
                    type="text"
                    placeholder="Add item..."
                    value={editInputs[cat.id] || ''}
                    onChange={(e) => setEditInputs({ ...editInputs, [cat.id]: e.target.value })}
                    className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#004b93]"
                  />
                  <button 
                    onClick={() => handleAddSubToExisting(cat.id, cat.sub_items)}
                    disabled={updateMutation.isPending}
                    className="p-2 bg-[#004b93] text-white rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    {updateMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={18} />}
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoryManager;