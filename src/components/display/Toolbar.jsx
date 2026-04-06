import React from 'react';

export default function Toolbar({ viewMode, setViewMode }) {
  // ممكن تستخدم مكتبة أيقونات زي lucide-react، هنا استخدمت أشكال مبسطة للتوضيح
  const views = [
    { id: 'list', icon: '☰' },
    { id: 'grid-2', icon: '◫' },
    { id: 'grid-3', icon: '⧉' },
    { id: 'grid-4', icon: '▦' }
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center py-4 mb-8 border-b border-gray-200 text-gray-600 text-sm">
      
      {/* طرق العرض */}
      <div className="flex items-center gap-4 mb-4 sm:mb-0">
        <span className="uppercase tracking-wider text-xs font-semibold">View As</span>
        <div className="flex gap-2">
          {views.map(view => (
            <button
              key={view.id}
              onClick={() => setViewMode(view.id)}
              className={`text-xl leading-none px-1 transition-colors ${
                viewMode === view.id ? 'text-blue-800 font-bold' : 'text-gray-400 hover:text-gray-800'
              }`}
            >
              {view.icon}
            </button>
          ))}
        </div>
      </div>

      {/* العناصر لكل صفحة */}
      <div className="flex items-center gap-3">
        <span className="uppercase tracking-wider text-xs font-semibold">Items Per Page</span>
        <select className="border border-gray-300 rounded px-4 py-2 bg-white text-gray-700 outline-none focus:border-blue-800">
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="50" selected>50</option>
        </select>
      </div>

    </div>
  );
}