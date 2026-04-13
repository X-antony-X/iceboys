import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../services/supabase';
import { Edit, Trash2, X, Plus, Loader2, AlertCircle, Save, ImagePlus } from 'lucide-react';

// ---------------------------------------------------------
// 1. دوال التعامل مع قاعدة البيانات (Supabase API Functions)
// ---------------------------------------------------------

const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const fetchCollectionsList = async () => {
  const { data, error } = await supabase
    .from('collections')
    .select('id, name');
  if (error) throw new Error(error.message);
  return data;
};

const fetchCategoriesData = async () => {
  const { data, error } = await supabase
    .from('header_categories')
    .select('main_name, sub_items');
  if (error) throw new Error(error.message);
  return data || [];
};

const deleteProduct = async (product) => {
  if (product.image_urls && product.image_urls.length > 0) {
    const pathsToDelete = product.image_urls.map(url => {
      const parts = url.split('/product-images/');
      return parts.length > 1 ? parts[1] : null;
    }).filter(Boolean);

    if (pathsToDelete.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('product-images')
        .remove(pathsToDelete);
        
      if (storageError) console.error("Error deleting images:", storageError);
    }
  }

  const { error: dbError } = await supabase
    .from('products')
    .delete()
    .eq('id', product.id);

  if (dbError) throw new Error(dbError.message);
  return product.id;
};

  const updateProduct = async (updatedData) => {
    const { id, main_category, ...dataToUpdate } = updatedData; 
    
    const { data, error } = await supabase
      .from('products')
      .update(dataToUpdate)
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);
    return data;
  };

// ---------------------------------------------------------
// 2. المكون الرئيسي: صفحة إدارة المنتجات
// ---------------------------------------------------------

export default function ManageProducts() {
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState(null);

  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ['admin-products'],
    queryFn: fetchProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      alert('Product and its images deleted successfully!');
    },
    onError: (err) => {
      alert(`Error deleting product: ${err.message}`);
    }
  });

  const handleDelete = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"? This will also delete its images from storage.`)) {
      deleteMutation.mutate(product);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-[#004b93] animate-spin mb-4" />
        <p className="font-bold text-gray-500 tracking-widest">LOADING PRODUCTS...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="font-bold">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-black uppercase text-[#2d2d2d] tracking-tighter">
            Manage Products
          </h1>
          <span className="bg-white px-4 py-2 rounded-sm shadow-sm text-sm font-bold text-gray-500">
            Total: {products?.length || 0}
          </span>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-widest text-gray-500">
                <th className="p-4 font-bold">Image</th>
                <th className="p-4 font-bold">Product Name</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Price</th>
                <th className="p-4 font-bold">Stock</th>
                <th className="p-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => {
                const totalStock = product.sizes?.reduce((acc, curr) => acc + parseInt(curr.quantity || 0), 0) || 0;
                
                return (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <img 
                        src={product.image_urls?.[0] || 'https://via.placeholder.com/150'} 
                        alt={product.name} 
                        className="w-12 h-16 object-cover rounded-sm border border-gray-200"
                      />
                    </td>
                    <td className="p-4 font-bold text-[#2d2d2d]">{product.name}</td>
                    <td className="p-4 text-sm text-gray-600">{product.category}</td>
                    <td className="p-4 font-black text-[#004b93]">LE {product.price}</td>
                    <td className="p-4 text-sm font-bold text-gray-600">
                      {totalStock > 0 ? (
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded-sm">{totalStock} in stock</span>
                      ) : (
                        <span className="text-red-500 bg-red-50 px-2 py-1 rounded-sm">Out of Stock</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setEditingProduct(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                          title="Edit Product"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product)}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-sm transition-colors disabled:opacity-50"
                          title="Delete Product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {products?.length === 0 && (
            <div className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest">
              No products available.
            </div>
          )}
        </div>
      </div>

      {editingProduct && (
        <EditProductModal 
          product={editingProduct} 
          onClose={() => setEditingProduct(null)} 
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------
// 3. مكون نافذة التعديل (Edit Modal) - المحدث بالتلاتة Select
// ---------------------------------------------------------

function EditProductModal({ product, onClose }) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  
  const { data: collections, isLoading: isCollectionsLoading } = useQuery({ queryKey: ['collections-list'], queryFn: fetchCollectionsList });
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({ queryKey: ['categories-data'], queryFn: fetchCategoriesData });

  const [formData, setFormData] = useState({
    id: product.id,
    name: product.name || '',
    collection: product.collection || '', 
    main_category: product.collection || '', // اجعلها تأخذ قيمة collection الافتراضية
    category: product.category || '',
    price: product.price || 0,
    description: product.description || '',
    sizes: product.sizes ? [...product.sizes] : [],
    collection_id: product.collection_id || '',
    image_urls: product.image_urls ? [...product.image_urls] : [],
  });

  // تحديد القوائم الفرعية المتاحة بناءً على الـ Main Category المختار
  const availableSubCategories = categoriesData?.find(
    cat => cat.main_name === formData.main_category
  )?.sub_items || [];

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      alert('Product updated successfully!');
      onClose();
    },
    onError: (err) => {
      alert(`Error updating product: ${err.message}`);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 1. معالج تغيير الـ Collection
  const handleCollectionChange = (e) => {
    const selectedId = e.target.value;
    const selectedColl = collections?.find(c => c.id.toString() === selectedId.toString());
    if (selectedColl) {
      setFormData(prev => ({
        ...prev,
        collection_id: selectedColl.id,
        collection: selectedColl.name
      }));
    }
  };

  const handleMainCategoryChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      main_category: value, // للقائمة المنسدلة في الـ UI
      collection: value,    // القيمة التي سيتم حفظها فعلياً في عمود collection بالداتابيز
      category: ''          // تصفير التصنيف الفرعي
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setIsUploading(true);
    const newUrls = [];
    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `products/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
        newUrls.push(publicUrl);
      }
      setFormData(prev => ({ ...prev, image_urls: [...prev.image_urls, ...newUrls] }));
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async (urlToRemove) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    setIsUploading(true);
    try {
      const parts = urlToRemove.split('/product-images/');
      const pathToDelete = parts.length > 1 ? parts[1] : null;
      if (pathToDelete) {
        await supabase.storage.from('product-images').remove([pathToDelete]);
      }
      setFormData(prev => ({ ...prev, image_urls: prev.image_urls.filter(url => url !== urlToRemove) }));
    } catch (error) {
      alert('Error deleting image: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index][field] = value;
    setFormData(prev => ({ ...prev, sizes: newSizes }));
  };

  const addSizeRow = () => {
    setFormData(prev => ({ ...prev, sizes: [...prev.sizes, { size: '', quantity: '0' }] }));
  };

  const removeSizeRow = (index) => {
    setFormData(prev => ({ ...prev, sizes: formData.sizes.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[1001] flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white rounded-md shadow-2xl w-full max-w-3xl my-8 relative max-h-[90vh] flex flex-col">
        
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center rounded-t-md z-10">
          <h2 className="text-xl font-black uppercase tracking-widest text-[#2d2d2d]">Edit Product</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Images Section */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Product Images</label>
              <div className="flex flex-wrap gap-4">
                {formData.image_urls.map((url, idx) => (
                  <div key={idx} className="relative w-24 h-32 border border-gray-200 rounded-sm group">
                    <img src={url} alt={`Product ${idx}`} className="w-full h-full object-cover rounded-sm" />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveImage(url)}
                      disabled={isUploading}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-md disabled:opacity-50 z-10"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <label className={`w-24 h-32 border-2 border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center text-gray-400 hover:text-[#004b93] hover:border-[#004b93] hover:bg-blue-50 transition-colors cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {isUploading ? <Loader2 size={24} className="animate-spin" /> : <ImagePlus size={24} />}
                  <span className="text-[10px] font-bold uppercase mt-2">UPLOAD</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                </label>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Product Details - التلاتة Select هنا */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:border-[#004b93] outline-none" />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Price (LE)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:border-[#004b93] outline-none" />
              </div>

              {/* 1. Collection Select */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Collection</label>
                <select 
                  value={formData.collection_id || ''} 
                  onChange={handleCollectionChange}
                  required
                  className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:border-[#004b93] outline-none bg-white"
                >
                  <option value="" disabled>Select Collection</option>
                  {collections?.map((coll) => (
                    <option key={coll.id} value={coll.id}>{coll.name}</option>
                  ))}
                </select>
              </div>

              {/* 2. Main Category Select */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Main Category (Gender/Group)
                </label>
                <select 
                  name="main_category"
                  value={formData.main_category} 
                  onChange={handleMainCategoryChange}
                  required
                  className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:border-[#004b93] outline-none bg-white"
                >
                  <option value="" disabled>Select Main Category</option>
                  {categoriesData?.map((cat, idx) => (
                    // نستخدم cat.main_name هنا بدلاً من cat.title
                    <option key={idx} value={cat.main_name}>{cat.main_name}</option>
                  ))}
                </select>
              </div>

              {/* 3. Sub Category Select */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Sub Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  required 
                  disabled={!formData.main_category || availableSubCategories.length === 0}
                  className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:border-[#004b93] outline-none bg-white disabled:bg-gray-100"
                >
                  <option value="" disabled>Select Sub Category</option>
                  {availableSubCategories.map((sub, idx) => (
                    <option key={idx} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:border-[#004b93] outline-none resize-none"></textarea>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Sizes Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Sizes & Quantities</label>
                <button type="button" onClick={addSizeRow} className="flex items-center gap-1 text-xs font-bold text-[#004b93] bg-blue-50 px-3 py-1.5 rounded-sm hover:bg-blue-100 transition-colors">
                  <Plus size={14} /> ADD SIZE
                </button>
              </div>
              <div className="space-y-3 bg-gray-50 p-4 rounded-sm border border-gray-100">
                {formData.sizes.map((sizeObj, index) => (
                  <div key={index} className="flex gap-4 items-center bg-white p-2 border border-gray-200 rounded-sm">
                    <input type="text" placeholder="Size" value={sizeObj.size} onChange={(e) => handleSizeChange(index, 'size', e.target.value)} className="flex-1 border-none focus:ring-0 outline-none uppercase font-bold text-sm" />
                    <input type="number" placeholder="Qty" value={sizeObj.quantity} onChange={(e) => handleSizeChange(index, 'quantity', e.target.value)} className="w-24 border-none focus:ring-0 outline-none font-bold text-[#004b93] text-sm" />
                    <button type="button" onClick={() => removeSizeRow(index)} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 flex justify-end gap-3 rounded-b-md z-10">
          <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-sm text-xs font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50">Cancel</button>
          <button type="submit" form="edit-form" disabled={updateMutation.isPending || isUploading} className="flex items-center gap-2 px-8 py-2.5 bg-[#004b93] rounded-sm text-xs font-black uppercase tracking-widest text-white hover:bg-[#00366b] disabled:opacity-70">
            {updateMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}