  const API_BASE_URL = "http://localhost:8080/generated-content";

  export const getScheduledContent = async (token, page = 0, size = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/scheduled?page=${page}&size=${size}`,
        {
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
