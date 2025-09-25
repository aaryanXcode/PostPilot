// Analytics Service for fetching real analytics data from backend

export const getAnalyticsData = async (token, dateRange = null) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
    const analyticsUrl = import.meta.env.VITE_ANALYTICS_URL || "/api/analytics";
    
    // Build query parameters for date range if provided
    let url = `${baseUrl}${analyticsUrl}`;
    
    // console.log("🚀 Analytics Service - Using URL:", url);
    // console.log("🔍 Environment variables:", {
    //   VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    //   VITE_ANALYTICS_URL: import.meta.env.VITE_ANALYTICS_URL
    // });
    // console.log("📅 Timestamp:", new Date().toISOString());
    if (dateRange) {
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    // console.log("Fetching analytics from URL:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch analytics data'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return { error: error.message };
  }
};

export const getPostAnalytics = async (token, postId) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
    const postAnalyticsUrl = import.meta.env.VITE_POST_ANALYTICS_URL || `/api/analytics/posts/${postId}`;
    const url = `${baseUrl}${postAnalyticsUrl}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch post analytics'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching post analytics:", error);
    return { error: error.message };
  }
};

export const getEngagementMetrics = async (token, dateRange = null) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
    const engagementUrl = import.meta.env.VITE_ENGAGEMENT_METRICS_URL || "/api/analytics/engagement";
    
    let url = `${baseUrl}${engagementUrl}`;
    if (dateRange) {
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch engagement metrics'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching engagement metrics:", error);
    return { error: error.message };
  }
};
