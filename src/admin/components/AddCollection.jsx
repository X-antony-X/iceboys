import React, { useState, useRef } from 'react';
import { Upload, X, Save, LayoutGrid, AlignLeft, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../services/supabase';

export default function AddCollection() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
  });
  
  const [imageFile, setImageFile] = useState(null); // تخزين ملف الصورة
  const [imagePreview, setImagePreview] = useState(null); // لمعاينة الصورة قبل الرفع
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // معالجة اختيار الصورة
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // إنشاء رابط مؤقت للمعاينة
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Please upload a collection image first!");
    
    setLoading(true);

    try {
      // 1. رفع الصورة إلى الـ Storage في فولدر collections
      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = `collections/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // 2. الحصول على رابط الصورة العمومي (Public URL)
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // 3. حفظ بيانات الكوليكشن في قاعدة البيانات مع رابط الصورة
      const { error: insertError } = await supabase
        .from('collections')
        .insert([{
          ...formData,
          image_url: publicUrl
        }]);

      if (insertError) throw insertError;

      alert("Collection Added Successfully! 🎉");
      
      // إعادة ضبط الفورم
      setFormData({ name: '', description: '', is_active: true });
      setImageFile(null);
      setImagePreview(null);

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#004b93] px-6 py-4 flex items-center gap-3">
          <LayoutGrid className="text-white" size={20} />
          <h2 className="text-white font-black uppercase tracking-widest text-lg">
            Add New Collection
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-[#2d2d2d]">
              Collection Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Winter Essentials 2026"
              className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:border-[#004b93] outline-none transition-all"
            />
          </div>

          {/* Custom Image Upload Section */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-[#2d2d2d]">
              Collection Cover Image
            </label>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageChange}
            />

            {!imagePreview ? (
              <div 
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-gray-200 rounded-sm bg-[#f8f9fa] p-12 flex flex-col items-center justify-center group hover:border-[#004b93] cursor-pointer transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <Upload size={20} className="text-gray-400 group-hover:text-[#004b93]" />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Click to upload image</p>
              </div>
            ) : (
              <div className="relative aspect-video w-full max-h-64 rounded-sm overflow-hidden border border-gray-200 shadow-inner">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => {setImageFile(null); setImagePreview(null);}}
                  className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-[#2d2d2d] flex items-center gap-2">
              <AlignLeft size={12} /> Description
            </label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Tell the story of this collection..."
              className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:border-[#004b93] outline-none resize-none"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-sm border border-gray-100">
            <button
              type="button"
              onClick={() => setFormData({...formData, is_active: !formData.is_active})}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                formData.is_active ? 'bg-[#004b93] text-white shadow-lg' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {formData.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
              {formData.is_active ? 'Visible on Store' : 'Hidden'}
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-gray-50">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2d2d2d] text-white px-12 py-4 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-black transition-all disabled:opacity-50 shadow-md"
            >
              <Save size={16} />
              {loading ? 'Processing...' : 'Save Collection'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}