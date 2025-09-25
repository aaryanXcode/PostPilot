import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { getAnalyticsData } from "../Services/AnalyticsService";
import { Loader } from "@/components/ui/shadcn-io/ai/loader";

const Analytics = () => {
  const { token } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(0);


  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        setError(null);
        // console.log("Analytics component - About to call getAnalyticsData with token:", token ? "present" : "missing");
        
        // First try the main analytics endpoint
        const data = await getAnalyticsData(token);
        
        if (data.error) {
          setError(data.error);
        } else {
          // console.log("📊 Analytics data received:", JSON.stringify(data, null, 2));
          
          // If generatedPostsCount is 0, try the test endpoint to get the real count
          let generatedPostsCount = data.generatedPostsCount || 0;
          
          if (generatedPostsCount === 0) {
            // console.log("📊 Generated posts count is 0, checking test endpoint...");
            try {
              const testResponse = await fetch("http://localhost:8080/api/analytics/test", {
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
              });
              
              if (testResponse.ok) {
                const testData = await testResponse.json();
                // console.log("📊 Test endpoint data:", JSON.stringify(testData, null, 2));
                
                // Use the totalGeneratedContentInDB as the generatedPostsCount
                generatedPostsCount = testData.totalGeneratedContentInDB || 0;
                // console.log("📊 Using test endpoint count:", generatedPostsCount);
              }
            } catch (testErr) {
              // console.log("📊 Test endpoint failed, using original count:", generatedPostsCount);
            }
          }
          
          // console.log("📊 Setting analytics data...");
          
          // Set the data in the same format as the working "Set Test Data" button
          const formattedData = {
            totalPosts: data.totalPosts || 0,
            generatedPostsCount: generatedPostsCount, // Use the corrected count
            publishedPostsCount: data.publishedPostsCount || 0,
            scheduledPostsCount: data.scheduledPostsCount || 0,
            draftPostsCount: data.draftPostsCount || 0,
            totalEngagement: data.totalEngagement || 0,
            totalReach: data.totalReach || 0,
            totalImpressions: data.totalImpressions || 0,
            avgEngagementRate: data.avgEngagementRate || 0,
            bestPostEngagement: data.bestPostEngagement || 0,
            totalFollowers: data.totalFollowers || 1200,
            recentPosts: data.recentPosts || []
          };
          
          setAnalyticsData(formattedData);
          setForceUpdate(prev => prev + 1); // Force re-render
          // console.log("📊 Analytics data set successfully with formatting");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  if (loading) {
    return (
      <div className="p-2 sm:p-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Analytics</h1>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Loader size={20} />
            <span className="text-muted-foreground">Loading analytics data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Analytics</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading analytics data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-y-auto">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Analytics Icons */}
        <div className="absolute top-10 left-10 animate-bounce delay-100">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        
        <div className="absolute top-20 right-16 animate-bounce delay-300">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-20 left-20 animate-bounce delay-500">
          <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-16 right-12 animate-bounce delay-700">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
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

      <div className="relative z-10 p-2 sm:p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            AI-Powered Social Media Insights
          </p>
        </div>

        {/* Main Metrics Grid - Post Status Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {analyticsData?.generatedPostsCount || analyticsData?.generatedPosts || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Posts</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Generated Posts</h3>
          </div>
          <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {analyticsData?.publishedPostsCount || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Published</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Published Posts</h3>
          </div>

          <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {analyticsData?.scheduledPostsCount || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Scheduled</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Scheduled Posts</h3>
          </div>

          <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {analyticsData?.draftPostsCount || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Drafts</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Draft Posts</h3>
          </div>
        </div>

        {/* Secondary Metrics Grid - Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {analyticsData?.totalEngagement || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Engagements</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Total Engagement</h3>
          </div>

          <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {analyticsData?.totalReach || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Reach</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Total Reach</h3>
          </div>

          <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {analyticsData?.totalImpressions || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Impressions</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Total Impressions</h3>
          </div>
        </div>

        {/* LinkedIn Engagement Metrics Grid */}
        {(() => {
          // console.log("🔍 Checking LinkedIn engagement metrics display condition:");
          // console.log("🔍 analyticsData exists:", !!analyticsData);
          // console.log("🔍 linkedinPostsCount:", analyticsData?.linkedinPostsCount);
          // console.log("🔍 linkedinPostsCount > 0:", analyticsData?.linkedinPostsCount > 0);
          console.log("🔍 All LinkedIn metrics:", {
            linkedinTotalLikes: analyticsData?.linkedinTotalLikes,
            linkedinTotalComments: analyticsData?.linkedinTotalComments,
            linkedinTotalShares: analyticsData?.linkedinTotalShares,
            linkedinTotalSaves: analyticsData?.linkedinTotalSaves,
            linkedinTotalReach: analyticsData?.linkedinTotalReach,
            linkedinTotalImpressions: analyticsData?.linkedinTotalImpressions,
            linkedinAvgEngagementRate: analyticsData?.linkedinAvgEngagementRate,
            linkedinPostsCount: analyticsData?.linkedinPostsCount
          });
          return null;
        })()}
        {analyticsData && analyticsData.linkedinPostsCount > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">LinkedIn Engagement Metrics</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {analyticsData?.linkedinTotalLikes || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Likes</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">LinkedIn Likes</h3>
              </div>

              <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {analyticsData?.linkedinTotalComments || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Comments</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">LinkedIn Comments</h3>
              </div>

              <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {analyticsData?.linkedinTotalShares || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Shares</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">LinkedIn Shares</h3>
              </div>

              <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      {analyticsData?.linkedinTotalSaves || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Saves</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">LinkedIn Saves</h3>
              </div>
            </div>

            {/* LinkedIn Reach and Impressions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      {analyticsData?.linkedinTotalReach || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Reach</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">LinkedIn Reach</h3>
              </div>

              <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                      {analyticsData?.linkedinTotalImpressions || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Impressions</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">LinkedIn Impressions</h3>
              </div>

              <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {analyticsData?.linkedinAvgEngagementRate?.toFixed(2) || 0}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Engagement Rate</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">LinkedIn Engagement Rate</h3>
              </div>
            </div>
          </div>
        )}
      
        {/* Additional Analytics Sections */}
        {analyticsData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Posts Performance */}
            <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Recent Posts Performance</h3>
              </div>
              <div className="space-y-3">
                {analyticsData?.recentPosts?.slice(0, 5).map((post, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                        {post.title || `Post ${index + 1}`}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      {post.engagement || 0}
                    </span>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">No recent posts data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Engagement Trends */}
            <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Engagement Trends</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Average Engagement Rate</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {analyticsData?.avgEngagementRate || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Best Performing Post</span>
                  </div>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {analyticsData?.bestPostEngagement || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Followers</span>
                  </div>
                  <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
                    {analyticsData?.totalFollowers || 0}
                  </span>
                </div>
        </div>
        </div>
        </div>
        )}

      </div>
    </div>
  );
};

export default Analytics;
