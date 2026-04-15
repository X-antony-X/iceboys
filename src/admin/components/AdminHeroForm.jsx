import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../services/supabase';
import { Loader2, Upload, Save } from 'lucide-react';

const fetchHeroData = async () => {
  const { data, error } = await supabase
    .from('hero_section')
    .select('*')
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export default function AdminHeroForm() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  // تحديث الـ state ليتوافق مع الـ SQL الجديد (badge_text و body)
  const [formData, setFormData] = useState({
    badge_text: '',
    body: '', 
  });

  const { data: heroData, isLoading } = useQuery({
    queryKey: ['hero_section'],
    queryFn: fetchHeroData,
  });

  useEffect(() => {
    if (heroData) {
      setFormData({
        badge_text: heroData.badge_text || '',
        body: heroData.body || '',
      });
      setPreview(heroData.image_url);
    }
  }, [heroData]);

  const mutation = useMutation({
    mutationFn: async (newData) => {
      let finalImageUrl = preview;

      if (file) {
        // 1. مسح الصورة القديمة
        if (heroData?.image_url) {
          try {
            // استخراج اسم الملف من الرابط الكامل
            // الرابط بيكون كدة: .../storage/v1/object/public/hero-images/hero-123.jpg
            const urlParts = heroData.image_url.split('/');
            const oldFileName = urlParts[urlParts.length - 1]; // بياخد آخر جزء في الرابط

            if (oldFileName) {
              const { error: deleteError } = await supabase.storage
                .from('hero-images')
                .remove([oldFileName]);

              if (deleteError) {
                console.error("Supabase Delete Error:", deleteError.message);
              } else {
                console.log("Deleted successfully:", oldFileName);
              }
            }
          } catch (err) {
            console.error("Parsing URL failed:", err);
          }
        }

        // 2. رفع الصورة الجديدة (نفس الكود بتاعك)
        const fileExt = file.name.split('.').pop();
        const fileName = `hero-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('hero-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('hero-images')
          .getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
      }

      // 3. تحديث قاعدة البيانات
      const { error } = await supabase
        .from('hero_section')
        .upsert({
          id: 1,
          ...newData,
          image_url: finalImageUrl,
          updated_at: new Date()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['hero_section']);
      alert('Updated & Storage Cleaned! 🧹');
      setFile(null);
    }
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-lg border border-gray-100 my-10">
      <h2 className="text-2xl font-black mb-6 text-[#004b93] uppercase tracking-tight">Manage Hero Section</h2>
      
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="space-y-6">
        
        {/* رفع الصورة - التعديل هنا */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Background Image</label>
          <div className="relative group h-48 w-full bg-gray-50 rounded-md border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Upload className="text-gray-300" size={40} />
            )}
            
            {/* جعلنا الـ input هو آخر عنصر وأعطيناه z-10 ليكون فوق كل شيء */}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            />
            
            {/* إضافة pointer-events-none هنا مهمة جداً */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold pointer-events-none">
              Click to Change Image
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-[#004b93]">Badge Text</label>
            <input 
              className="w-full border border-gray-200 p-3 rounded-sm text-sm focus:ring-2 focus:ring-[#004b93] outline-none"
              placeholder="Badge Text..."
              value={formData.badge_text}
              onChange={(e) => setFormData({...formData, badge_text: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-[#004b93]">Main Body Text</label>
            <textarea 
              className="w-full border border-gray-200 p-3 rounded-sm text-sm outline-none focus:border-[#004b93]"
              rows="4"
              placeholder="Body Text..."
              value={formData.body}
              onChange={(e) => setFormData({...formData, body: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-[#004b93] text-white py-4 rounded-sm font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#00366b] transition-all disabled:bg-gray-400"
        >
          {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Update Hero Section
        </button>
      </form>
    </div>
  );
}