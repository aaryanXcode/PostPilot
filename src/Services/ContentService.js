  export const getScheduledContent = async (token, page = 0, size = 10) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const scheduledContentUrl = import.meta.env.VITE_SCHEDULED_CONTENT_URL || '/generated-content/scheduled';
      const url = `${baseUrl}${scheduledContentUrl}?page=${page}&size=${size}`;
      console.log('=== FRONTEND: Fetching scheduled content ===');
      console.log('URL:', url);
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('Page:', page, 'Size:', size);
      
      const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response not OK:', response.status, errorText);
        throw new Error(`Failed to fetch scheduled content: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('=== FRONTEND: Received data ===');
      console.log('Data:', data);
      console.log('Content length:', data.content ? data.content.length : 'No content array');
      console.log('Total elements:', data.totalElements);
      console.log('Total pages:', data.totalPages);
      
      return data; // This will be a Page<ScheduledContentDTO>
    } catch (error) {
      console.error("Error fetching scheduled content:", error);
      return { content: [], totalPages: 0, totalElements: 0 };
    }
  };
