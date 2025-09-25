import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { useAuth } from './AuthContext';
import { getAnalyticsData } from '../Services/AnalyticsService';
import { getScheduledContent } from '../Services/ContentService';
import { useTheme } from 'next-themes';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const DashboardGraphs = () => {
  const { token } = useAuth();
  const { theme } = useTheme();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [scheduledData, setScheduledData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch analytics data
        const analytics = await getAnalyticsData(token);
        console.log('=== DASHBOARD GRAPHS: Analytics Data ===', analytics);
        setAnalyticsData(analytics);
        
        // Fetch scheduled content data
        const scheduled = await getScheduledContent(token, 0, 1000); // Get all data
        console.log('=== DASHBOARD GRAPHS: Scheduled Data ===', scheduled);
        setScheduledData(scheduled);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading dashboard data: {error}
      </div>
    );
  }

  // Prepare data for charts
  console.log('=== DASHBOARD GRAPHS: Preparing chart data ===');
  console.log('Analytics data:', analyticsData);
  console.log('Published count:', analyticsData?.publishedPostsCount);
  console.log('Scheduled count:', analyticsData?.scheduledPostsCount);
  console.log('Draft count:', analyticsData?.draftPostsCount);
  console.log('Total generated:', analyticsData?.totalGeneratedPosts);
  
  // Calculate totals from scheduled data as fallback
  const totalFromScheduled = scheduledData?.totalElements || 0;
  const publishedFromScheduled = scheduledData?.content?.filter(item => item.contentStatus === 'PUBLISHED' && !item.isScheduled).length || 0;
  const scheduledFromScheduled = scheduledData?.content?.filter(item => item.contentStatus !== 'PUBLISHED' && item.isScheduled).length || 0;
  const draftFromScheduled = scheduledData?.content?.filter(item => item.contentStatus !== 'PUBLISHED' && !item.isScheduled).length || 0;
  
  console.log('=== FALLBACK DATA FROM SCHEDULED ===');
  console.log('Total from scheduled:', totalFromScheduled);
  console.log('Published from scheduled:', publishedFromScheduled);
  console.log('Scheduled from scheduled:', scheduledFromScheduled);
  console.log('Draft from scheduled:', draftFromScheduled);
  
  const contentStatusData = {
    labels: ['Published', 'Scheduled', 'Draft', 'Total Generated'],
    datasets: [
      {
        label: 'Content Count',
        data: [
          analyticsData?.publishedPostsCount || publishedFromScheduled,
          analyticsData?.scheduledPostsCount || scheduledFromScheduled,
          analyticsData?.draftPostsCount || draftFromScheduled,
          analyticsData?.totalGeneratedPosts || totalFromScheduled,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',   // Green for published
          'rgba(59, 130, 246, 0.8)',  // Blue for scheduled
          'rgba(251, 191, 36, 0.8)',  // Yellow for draft
          'rgba(168, 85, 247, 0.8)',  // Purple for total
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(168, 85, 247, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const pieChartData = {
    labels: ['Published', 'Scheduled', 'Draft'],
    datasets: [
      {
        data: [
          analyticsData?.publishedPostsCount || publishedFromScheduled,
          analyticsData?.scheduledPostsCount || scheduledFromScheduled,
          analyticsData?.draftPostsCount || draftFromScheduled,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 191, 36, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(251, 191, 36, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Platform distribution data
  const platformData = {
    labels: ['LinkedIn', 'Facebook', 'Instagram', 'Twitter', 'Pinterest'],
    datasets: [
      {
        label: 'Posts by Platform',
        data: [
          scheduledData?.content?.filter(item => item.platform === 'LINKEDIN').length || 0,
          scheduledData?.content?.filter(item => item.platform === 'FACEBOOK').length || 0,
          scheduledData?.content?.filter(item => item.platform === 'INSTAGRAM').length || 0,
          scheduledData?.content?.filter(item => item.platform === 'TWITTER').length || 0,
          scheduledData?.content?.filter(item => item.platform === 'PINTEREST').length || 0,
        ],
        backgroundColor: [
          'rgba(0, 119, 181, 0.8)',   // LinkedIn blue
          'rgba(24, 119, 242, 0.8)',  // Facebook blue
          'rgba(225, 48, 108, 0.8)',  // Instagram pink
          'rgba(29, 161, 242, 0.8)',  // Twitter blue
          'rgba(189, 8, 28, 0.8)',    // Pinterest red
        ],
        borderColor: [
          'rgba(0, 119, 181, 1)',
          'rgba(24, 119, 242, 1)',
          'rgba(225, 48, 108, 1)',
          'rgba(29, 161, 242, 1)',
          'rgba(189, 8, 28, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Engagement metrics data
  const engagementData = {
    labels: ['Total Engagement', 'Total Reach', 'Total Impressions'],
    datasets: [
      {
        label: 'Engagement Metrics',
        data: [
          analyticsData?.totalEngagement || 0,
          analyticsData?.totalReach || 0,
          analyticsData?.totalImpressions || 0,
        ],
        backgroundColor: [
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
        ],
        borderColor: [
          'rgba(168, 85, 247, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(14, 165, 233, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme === 'dark' ? '#F9FAFB' : '#374151',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        color: theme === 'dark' ? '#F9FAFB' : '#374151',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(156, 163, 175, 0.1)' : 'rgba(107, 114, 128, 0.1)',
        },
      },
      x: {
        ticks: {
          color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(156, 163, 175, 0.1)' : 'rgba(107, 114, 128, 0.1)',
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: theme === 'dark' ? '#F9FAFB' : '#374151',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        color: theme === 'dark' ? '#F9FAFB' : '#374151',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Content Status Overview */}
      <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          Content Status Overview
        </h3>
        <div className="h-80">
          <Bar data={contentStatusData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Distribution Pie Chart */}
        <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            Content Distribution
          </h3>
          <div className="h-80">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
              </svg>
            </div>
            Platform Distribution
          </h3>
          <div className="h-80">
            <Bar data={platformData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData?.publishedPostsCount || publishedFromScheduled}</p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData?.scheduledPostsCount || scheduledFromScheduled}</p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Draft</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData?.draftPostsCount || draftFromScheduled}</p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Generated</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData?.totalGeneratedPosts || totalFromScheduled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          Engagement Metrics
        </h3>
        <div className="h-80">
          <Bar data={engagementData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardGraphs;
