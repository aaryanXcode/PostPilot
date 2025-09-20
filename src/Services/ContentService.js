  export const getScheduledContent = async (token, page = 0, size = 10) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const scheduledContentUrl = import.meta.env.VITE_SCHEDULED_CONTENT_URL;
      const url = `${baseUrl}${scheduledContentUrl}?page=${page}&size=${size}`;
      
      const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch scheduled content");
      }

      return await response.json(); // This will be a Page<ScheduledContentDTO>
    } catch (error) {
      console.error("Error fetching scheduled content:", error);
      return { content: [], totalPages: 0, totalElements: 0 };
    }
  };
