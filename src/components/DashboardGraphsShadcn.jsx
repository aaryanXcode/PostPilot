import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getAnalyticsData } from '../Services/AnalyticsService';
import { getScheduledContent } from '../Services/ContentService';
import { useTheme } from 'next-themes';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from './ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const DashboardGraphsShadcn = () => {
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
        
        const analytics = await getAnalyticsData(token);
        setAnalyticsData(analytics);
        
        const scheduled = await getScheduledContent(token, 0, 1000);
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

  // Calculate data
  const totalFromScheduled = scheduledData?.totalElements || 0;
  const publishedFromScheduled = scheduledData?.content?.filter(item => item.contentStatus === 'PUBLISHED' && !item.isScheduled).length || 0;
  const scheduledFromScheduled = scheduledData?.content?.filter(item => item.contentStatus !== 'PUBLISHED' && item.isScheduled).length || 0;
  const draftFromScheduled = scheduledData?.content?.filter(item => item.contentStatus !== 'PUBLISHED' && !item.isScheduled).length || 0;
  
  // Prepare data for charts
  const contentStatusData = [
    {
      name: 'Published',
      value: analyticsData?.publishedPostsCount || publishedFromScheduled,
      fill: 'hsl(var(--chart-1))',
    },
    {
      name: 'Scheduled',
      value: analyticsData?.scheduledPostsCount || scheduledFromScheduled,
      fill: 'hsl(var(--chart-2))',
    },
    {
      name: 'Draft',
      value: analyticsData?.draftPostsCount || draftFromScheduled,
      fill: 'hsl(var(--chart-3))',
    },
    {
      name: 'Total Generated',
      value: analyticsData?.totalGeneratedPosts || totalFromScheduled,
      fill: 'hsl(var(--chart-4))',
    },
  ];

  const pieChartData = [
    {
      name: 'Published',
      value: analyticsData?.publishedPostsCount || publishedFromScheduled,
      fill: 'hsl(var(--chart-1))',
    },
    {
      name: 'Scheduled',
      value: analyticsData?.scheduledPostsCount || scheduledFromScheduled,
      fill: 'hsl(var(--chart-2))',
    },
    {
      name: 'Draft',
      value: analyticsData?.draftPostsCount || draftFromScheduled,
      fill: 'hsl(var(--chart-3))',
    },
  ];

  const platformData = [
    {
      name: 'LinkedIn',
      value: scheduledData?.content?.filter(item => item.platform === 'LINKEDIN').length || 0,
      fill: 'hsl(var(--chart-1))',
    },
    {
      name: 'Facebook',
      value: scheduledData?.content?.filter(item => item.platform === 'FACEBOOK').length || 0,
      fill: 'hsl(var(--chart-2))',
    },
    {
      name: 'Instagram',
      value: scheduledData?.content?.filter(item => item.platform === 'INSTAGRAM').length || 0,
      fill: 'hsl(var(--chart-3))',
    },
    {
      name: 'Twitter',
      value: scheduledData?.content?.filter(item => item.platform === 'TWITTER').length || 0,
      fill: 'hsl(var(--chart-4))',
    },
    {
      name: 'Pinterest',
      value: scheduledData?.content?.filter(item => item.platform === 'PINTEREST').length || 0,
      fill: 'hsl(var(--chart-5))',
    },
  ];

  const engagementData = [
    {
      name: 'Total Engagement',
      value: analyticsData?.totalEngagement || 0,
      fill: 'hsl(var(--chart-1))',
    },
    {
      name: 'Total Reach',
      value: analyticsData?.totalReach || 0,
      fill: 'hsl(var(--chart-2))',
    },
    {
      name: 'Total Impressions',
      value: analyticsData?.totalImpressions || 0,
      fill: 'hsl(var(--chart-3))',
    },
  ];

  const chartConfig = {
    value: {
      label: "Count",
    },
    published: {
      label: "Published",
      color: "hsl(var(--chart-1))",
    },
    scheduled: {
      label: "Scheduled",
      color: "hsl(var(--chart-2))",
    },
    draft: {
      label: "Draft",
      color: "hsl(var(--chart-3))",
    },
    total: {
      label: "Total Generated",
      color: "hsl(var(--chart-4))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Content Status Overview */}
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            Content Status Overview
          </CardTitle>
          <CardDescription>
            Overview of your content across different statuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contentStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Distribution Pie Chart */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              Content Distribution
            </CardTitle>
            <CardDescription>
              Distribution of your content by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={40}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                </svg>
              </div>
              Platform Distribution
            </CardTitle>
            <CardDescription>
              Posts distributed across social media platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
          <CardContent className="p-4">
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
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
          <CardContent className="p-4">
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
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
          <CardContent className="p-4">
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
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
          <CardContent className="p-4">
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
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            Engagement Metrics
          </CardTitle>
          <CardDescription>
            Performance metrics for your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--chart-1))" 
                    fill="hsl(var(--chart-1))" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardGraphsShadcn;
