export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-5xl font-black tracking-tighter mb-6 text-[#cc0000] dark:text-[#ff4d4d]">
        Welcome to PremierNews
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
        Stay up to date with the most exciting stories, breaking news, and exclusive insights from around the world.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:-translate-y-1">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 w-full object-cover"></div>
            <div className="p-6">
              <span className="text-xs font-bold text-[#cc0000] dark:text-[#ff4d4d] uppercase tracking-wider mb-2 block">Category</span>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Breaking News Headline #{item}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                This is a summary of the breaking news story. Read more to find out all the exciting details and updates.
              </p>
              <button className="text-[#cc0000] dark:text-[#ff4d4d] font-bold text-sm hover:underline">
                Read Full Story →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
