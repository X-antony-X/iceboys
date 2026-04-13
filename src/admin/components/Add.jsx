import React, { useState } from 'react';
import { Plus, Trash2, Save, X, Loader2 } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query'; 
import { supabase } from '../../services/supabase';
import { Link } from 'react-router-dom';

const Add = () => {
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    const [product, setProduct] = useState({
        name: '',
        collection: '', // الخانة الأصلية
        productGroup: '', // الخانة الجديدة التي تطلبها
        category: '',
        price: '',
        description: '',
    });

    const [sizes, setSizes] = useState([{ size: '', quantity: '' }]);

    // ==========================================
    // 1. جلب البيانات من جدول header_categories (القديم)
    // ==========================================
    const { data: dbCategories, isLoading: isLoadingCats } = useQuery({
        queryKey: ['header_categories'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('header_categories')
                .select('*');
            if (error) throw error;
            return data;
        }
    });

    // ==========================================
    // 2. جلب البيانات من جدول collections (الجديد)
    // ==========================================
    const { data: dbCollections, isLoading: isLoadingColls } = useQuery({
        queryKey: ['collections_list'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('collections')
                .select('*');
            if (error) throw error;
            return data;
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'collection') {
            setProduct({ ...product, collection: value, category: '' });
            setSizes([{ size: '', quantity: '' }]);
        } else {
            setProduct({ ...product, [name]: value });
        }
    };

    const currentSubItems = dbCategories?.find(cat => cat.main_name === product.collection)?.sub_items || [];

    const handleSizeChange = (index, field, value) => {
        const newSizes = [...sizes];
        newSizes[index][field] = value;
        setSizes(newSizes);
    };

    const addSizeRow = () => setSizes([...sizes, { size: '', quantity: '' }]);
    const removeSizeRow = (index) => setSizes(sizes.filter((_, i) => i !== index));

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages((prev) => [...prev, ...files]);
        const filePreviews = files.map(file => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...filePreviews]);
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(previews[index]);
        setImages(images.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const getAvailableSizes = () => {
        const cat = product.category.toLowerCase();
        const coll = product.collection.toLowerCase();
        
        if (cat.includes('fragrance') || cat.includes('perfume')) return ['50ml', '100ml', '150ml'];
        if (cat.includes('bag')) return ['One Size'];
        if (coll.includes('winter') || coll.includes('summer')) {
            return ['S', 'M', 'L', 'XL', 'XXL', '3XL'];
        }
        return ['S', 'M', 'L', 'XL'];
    };

    const addProductMutation = useMutation({
        mutationFn: async (finalData) => {
            const uploadedImageUrls = await Promise.all(
                images.map(async (file) => {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                    const filePath = `products/${fileName}`;
                    const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
                    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
                    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
                    return data.publicUrl;
                })
            );

            const { data, error } = await supabase
                .from('products')
                .insert([{
                    name: finalData.name,
                    collection: finalData.collection,
                    collection_id: finalData.productGroup || null, // نرسل الـ ID للعمود الصحيح
                    category: finalData.category,
                    price: parseFloat(finalData.price),
                    description: finalData.description,
                    sizes: finalData.sizes,
                    image_urls: uploadedImageUrls
                }])
                .select();

            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: () => {
            alert('Product added successfully! 🎉');
            setProduct({ name: '', collection: '', productGroup: '', category: '', price: '', description: '' });
            setSizes([{ size: '', quantity: '' }]);
            setImages([]);
            setPreviews([]);
        },
        onError: (error) => alert(`Error: ${error.message}`)
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (images.length === 0) return alert('Please upload at least one image!');
        const filteredSizes = sizes.filter(s => s.size !== '' && s.quantity !== '');
        if (filteredSizes.length === 0) return alert('Please add at least one valid size.');
        addProductMutation.mutate({ ...product, sizes: filteredSizes });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#004b93] p-6 text-white">
                    <h1 className="text-2xl font-black tracking-tight uppercase">Add New Product</h1>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    <div>
                        <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase">Product Name</label>
                        <input type="text" name="name" value={product.name} onChange={handleInputChange} required placeholder="e.g. Navy Blue Over-sized Hoodie" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b93]" />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[13px] font-bold text-gray-700 uppercase">Product Images</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-[#004b93] transition-all group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Plus className="w-8 h-8 text-gray-400 group-hover:text-[#004b93] mb-2" />
                                    <p className="text-[11px] font-bold text-gray-500 group-hover:text-[#004b93]">UPLOAD</p>
                                </div>
                                <input type="file" className="hidden" multiple onChange={handleImageChange} accept="image/*" />
                            </label>
                            {previews.map((src, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                                    <img src={src} alt="preview" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* القسم الخاص بالاختيارات الثلاثة */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* 1. الخانة الجديدة (تختار من جدول collections) */}
                        <div>
                            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase">
                                Product Group (From Collections)
                            </label>
                            <select 
                                name="productGroup" 
                                value={product.productGroup} 
                                onChange={handleInputChange} 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b93]"
                            >
                                <option value="" disabled>{isLoadingColls ? 'Loading...' : 'Select Group'}</option>
                                
                                {dbCollections?.map((coll) => (
                                    /* الـ value هنا هي الـ ID (وده اللي هيروح للـ Database عشان ميعملش Error)
                                    لكن اللي بين العلامتين هو الـ Name (وده اللي هيظهر للمستخدم في القائمة)
                                    */
                                    <option key={coll.id} value={coll.id}>
                                        {coll.name || coll.main_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 2. خانة Collection الأصلية */}
                        <div>
                            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase">Collection</label>
                            <select 
                                name="collection" 
                                value={product.collection} 
                                onChange={handleInputChange} 
                                required 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b93]"
                            >
                                <option value="" disabled>{isLoadingCats ? 'Loading...' : 'Select Collection'}</option>
                                {dbCategories?.map((item) => (
                                    <option key={item.id} value={item.main_name}>
                                        {item.main_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 3. خانة Category الأصلية */}
                        <div>
                            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase">Category</label>
                            <select 
                                name="category" 
                                value={product.category} 
                                onChange={handleInputChange} 
                                required 
                                disabled={!product.collection} 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b93] disabled:opacity-50"
                            >
                                <option value="" disabled>Select Category</option>
                                {currentSubItems.map((sub) => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase">Price (LE)</label>
                        <input type="number" name="price" value={product.price} onChange={handleInputChange} required min="0" step="0.01" className="w-full md:w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b93]" />
                    </div>

                    <div className="border border-gray-200 rounded-md p-5 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-[13px] font-bold text-gray-700 uppercase">Sizes & Quantities</label>
                            <button type="button" onClick={addSizeRow} className="flex items-center gap-1 text-xs font-bold text-[#004b93] bg-blue-100 px-3 py-1.5 rounded"><Plus size={14} /> Add Size</button>
                        </div>
                        <div className="space-y-3">
                            {sizes.map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <select value={item.size} onChange={(e) => handleSizeChange(index, 'size', e.target.value)} required className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-md">
                                        <option value="" disabled>Size / Vol</option>
                                        {getAvailableSizes().map(size => <option key={size} value={size}>{size}</option>)}
                                    </select>
                                    <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleSizeChange(index, 'quantity', e.target.value)} required className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-md" />
                                    {sizes.length > 1 && (
                                        <button type="button" onClick={() => removeSizeRow(index)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase">Description</label>
                        <textarea name="description" value={product.description} onChange={handleInputChange} required rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md resize-none" />
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={addProductMutation.isPending} 
                            className="flex items-center gap-2 bg-[#2d2d2d] hover:bg-[#004b93] text-white px-8 py-3 rounded-md font-bold text-[13px] tracking-widest uppercase transition-colors"
                        >
                            {addProductMutation.isPending ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Product</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Add;