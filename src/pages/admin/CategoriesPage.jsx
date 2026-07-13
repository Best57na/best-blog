const CATEGORIES = [
  { name: 'Highlight', description: 'Featured and trending articles' },
  { name: 'Adventure', description: 'Travel adventures and explorations' },
  { name: 'Culture', description: 'Cultural experiences and traditions' },
  { name: 'Food', description: 'Local cuisine and food guides' },
  { name: 'Tips', description: 'Travel tips and recommendations' },
]

export default function CategoriesPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Category management</h1>
      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Category name</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Description</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map(cat => (
              <tr key={cat.name} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full"
                    style={{ backgroundColor: '#D7F2E9', color: '#12B279' }}>
                    {cat.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{cat.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
