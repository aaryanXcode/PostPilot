import { useEffect, useState } from "react";
import { getScheduledContent } from "../Services/ContentService";
import { useAuth } from "@/components/AuthContext";
import PublishedPosts from "./ScheduledCmponents/PublishedPosts";
import ScheduledPosts from "./ScheduledCmponents/ScheduledPosts";
import DraftPosts from "./ScheduledCmponents/DraftPosts"; 

const Scheduled = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const pageSize = 10; // number of items per fetch


  // Fetch all pages automatically
  useEffect(() => {
    const fetchAllPages = async () => {
      let currentPage = 0;
      let hasMoreData = true;
      let allItems = [];

      while (hasMoreData) {
        try {
          console.log(`=== FRONTEND: Fetching page ${currentPage} ===`);
          const data = await getScheduledContent(token, currentPage, pageSize);
          
          console.log(`Page ${currentPage} data:`, data);
          console.log(`Content length: ${data.content ? data.content.length : 0}`);
          console.log(`Total pages: ${data.totalPages}`);
          
          if (data.content && data.content.length > 0) {
            allItems = [...allItems, ...data.content];
            currentPage++;
            
            if (currentPage >= data.totalPages) {
              hasMoreData = false;
            }
          } else {
            hasMoreData = false;
          }
        } catch (error) {
          console.error("Error fetching scheduled content:", error);
          hasMoreData = false;
        }
      }

      // Remove duplicates and set all items
      const uniqueItems = Array.from(new Map(allItems.map(item => [item.id, item])).values());
      console.log(`=== FRONTEND: Total items collected: ${allItems.length} ===`);
      console.log(`=== FRONTEND: Unique items after deduplication: ${uniqueItems.length} ===`);
      console.log('All items:', uniqueItems);
      
      setItems(uniqueItems);
    };

    fetchAllPages();
  }, [token]);

  // Split items into pending and completed
  const published = items.filter(
    (post) => post.contentStatus === "PUBLISHED" && !post.isScheduled
  );
  const scheduled = items.filter(
    (post) => post.contentStatus !== "PUBLISHED" && post.isScheduled
  );
  const drafts = items.filter(
    (post) => post.contentStatus !== "PUBLISHED" && !post.isScheduled
  );

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-y-auto">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Schedule Icons */}
        <div className="absolute top-10 left-10 animate-bounce delay-100">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        
        <div className="absolute top-20 right-16 animate-bounce delay-300">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-20 left-20 animate-bounce delay-500">
          <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-16 right-12 animate-bounce delay-700">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="absolute top-32 right-8 animate-pulse delay-200">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
        </div>

        <div className="absolute bottom-32 left-8 animate-pulse delay-400">
          <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="relative z-10 space-y-4 sm:space-y-6 p-2 sm:p-4 overflow-y-auto h-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Scheduled Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Manage Your Content Calendar
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Scheduled Posts Section */}
          <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Scheduled Posts</h2>
            </div>
            <ScheduledPosts
              items={scheduled}
            />
          </div>

          {/* Published Posts Section */}
          <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Published Posts</h2>
            </div>
            <PublishedPosts items={published} />
          </div>

          {/* Draft Posts Section */}
          <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Draft Posts</h2>
            </div>
            <DraftPosts items={drafts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduled;
