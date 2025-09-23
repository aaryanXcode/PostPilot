   const baseUrl = import.meta.env.VITE_API_BASE_URL;
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

// ContentService.js

export const fetchPostById = async (id, token) => {
  try {
   
    const generatedContent = import.meta.env.VITE_GENERATED_CONTENT_URL;
    const url = `${baseUrl}${generatedContent}/post/${id}`;
    console.log(url, token);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`);
    }

    const content = await response.text(); // backend returns raw string
    return { id, content };
  } catch (error) {
    console.error("Error fetching post by id:", error);
    return { id, content: "" }; // default value if fetch fails
  }
};

export const updatePostById = async (id, newContent, token) => {
  try {

    const generatedContent = import.meta.env.VITE_GENERATED_CONTENT_URL;
    const url = `${baseUrl}${generatedContent}/post/${id}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newContent), // backend expects raw string
    });

    if (!response.ok) {
      throw new Error(`Failed to update post: ${response.status}`);
    }

    const message = await response.text(); // returns success message
    return { success: true, message };
  } catch (error) {
    console.error("Error updating post:", error);
    return { success: false, message: "Failed to update post" };
  }
};


