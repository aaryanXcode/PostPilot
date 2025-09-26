// News Service for fetching tech news and trends

export const getTechNews = async (token, page = 0, category = null, country = 'us', language = 'en') => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseUrl}/api/news/tech`;
    
    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', page);
    if (category) params.append('category', category);
    params.append('country', country);
    params.append('language', language);
    
    const fullUrl = `${url}?${params.toString()}`;
    
    console.log("📰 News Service - Fetching tech news from:", fullUrl);
    
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch tech news'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tech news:", error);
    return { error: error.message };
  }
};

export const getLatestTechNews = async (token, limit = null) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseUrl}/api/news/tech/latest`;
    
    // Build query parameters
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    
    const fullUrl = `${url}?${params.toString()}`;
    
    console.log("📰 News Service - Fetching latest tech news from:", fullUrl);
    
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch latest tech news'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching latest tech news:", error);
    return { error: error.message };
  }
};

export const getTechTrends = async (token) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseUrl}/api/news/tech/trends`;
    
    console.log("📈 News Service - Fetching tech trends from:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch tech trends'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tech trends:", error);
    return { error: error.message };
  }
};

export const searchTechNews = async (token, query, page = 0) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseUrl}/api/news/tech/search`;
    
    // Build query parameters
    const params = new URLSearchParams();
    params.append('query', query);
    params.append('page', page);
    
    const fullUrl = `${url}?${params.toString()}`;
    
    console.log("🔍 News Service - Searching tech news from:", fullUrl);
    
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to search tech news'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching tech news:", error);
    return { error: error.message };
  }
};

export const getTechCategories = async (token) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseUrl}/api/news/tech/categories`;
    
    console.log("📂 News Service - Fetching tech categories from:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch tech categories'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tech categories:", error);
    return { error: error.message };
  }
};

export const checkNewsHealth = async (token) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseUrl}/api/news/health`;
    
    console.log("🏥 News Service - Checking news API health from:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to check news health'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking news health:", error);
    return { error: error.message };
  }
};
