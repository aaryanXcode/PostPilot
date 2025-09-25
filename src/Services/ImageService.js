// Image Service for fetching and managing images from the server

export const fetchAllImages = async (token, page = 0, size = 20, filters = {}) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const imagesUrl = import.meta.env.VITE_IMAGES_URL;
    
    // Build query parameters based on your backend API
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    params.append('sortBy', filters.sortBy || 'generatedAt');
    params.append('sortDir', filters.sortDir || 'desc');
    
    const url = `${baseUrl}${imagesUrl}?${params.toString()}`;
    
    console.log("🖼️ Image Service - Fetching images from:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch images'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching images:", error);
    return { error: error.message };
  }
};

export const fetchAllImagesSimple = async (token) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const imagesUrl = import.meta.env.VITE_IMAGES_URL;
    const url = `${baseUrl}${imagesUrl}/all`;
    
    console.log("🖼️ Image Service - Fetching all images from:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch images'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all images:", error);
    return { error: error.message };
  }
};

export const fetchImagesByUser = async (token, userId, page = 0, size = 20) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const imagesUrl = import.meta.env.VITE_IMAGES_URL;
    const url = `${baseUrl}${imagesUrl}/user/${userId}?page=${page}&size=${size}`;
    
    console.log("🖼️ Image Service - Fetching user images from:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch user images'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user images:", error);
    return { error: error.message };
  }
};

export const fetchImagesBySession = async (token, sessionId) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const imagesUrl = import.meta.env.VITE_IMAGES_URL;
    const url = `${baseUrl}${imagesUrl}/session/${sessionId}`;
    
    console.log("🖼️ Image Service - Fetching session images from:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch session images'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching session images:", error);
    return { error: error.message };
  }
};

export const fetchImageById = async (token, imageId) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const imagesUrl = import.meta.env.VITE_IMAGES_URL;
    const url = `${baseUrl}${imagesUrl}/${imageId}`;
    
    console.log("🖼️ Image Service - Fetching image by ID from:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch image'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching image by ID:", error);
    return { error: error.message };
  }
};

export const uploadImage = async (token, file, metadata = {}) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const uploadUrl = import.meta.env.VITE_IMAGE_UPLOAD_URL;
    const url = `${baseUrl}${uploadUrl}`;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', metadata.name || file.name);
    formData.append('type', metadata.type || 'uploaded');
    if (metadata.tags && metadata.tags.length > 0) {
      formData.append('tags', JSON.stringify(metadata.tags));
    }
    if (metadata.description) {
      formData.append('description', metadata.description);
    }
    
    console.log("📤 Image Service - Uploading image:", file.name);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to upload image'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading image:", error);
    return { error: error.message };
  }
};

export const uploadImageForContent = async (token, file, generatedContentId, metadata = {}) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const uploadUrl = `${baseUrl}/api/images/upload-for-content`;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('generatedContentId', generatedContentId);
    formData.append('fileName', metadata.fileName || file.name);
    formData.append('altText', metadata.altText || file.name);
    formData.append('imagePrompt', metadata.imagePrompt || 'User uploaded image');
    if (metadata.fileSize) {
      formData.append('fileSize', metadata.fileSize);
    }
    
    console.log("📤 Image Service - Uploading image for content:", file.name, "Content ID:", generatedContentId);
    
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to upload image for content'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading image for content:", error);
    return { error: error.message };
  }
};

export const deleteImage = async (token, imageId) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const imagesUrl = import.meta.env.VITE_IMAGES_URL;
    const url = `${baseUrl}${imagesUrl}/${imageId}`;
    
    console.log("🗑️ Image Service - Deleting image:", imageId);
    
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to delete image'}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { error: error.message };
  }
};

export const deleteImageFromContent = async (token, imageId) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseUrl}/api/images/${imageId}`;
    
    console.log("🗑️ Image Service - Deleting image from content:", imageId);
    
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to delete image from content'}`);
    }
    
    console.log("✅ Image Service - Image deleted from content successfully");
    return { success: true };
  } catch (error) {
    console.error("Error deleting image from content:", error);
    return { error: error.message };
  }
};

export const deleteMultipleImages = async (token, imageIds) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const deleteUrl = import.meta.env.VITE_IMAGE_DELETE_URL.replace('{imageId}', 'batch');
    const url = `${baseUrl}${deleteUrl}`;
    
    console.log("🗑️ Image Service - Deleting multiple images:", imageIds);
    
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ imageIds }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to delete images'}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting multiple images:", error);
    return { error: error.message };
  }
};

export const downloadImage = async (token, imageId) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const downloadUrl = import.meta.env.VITE_IMAGE_DOWNLOAD_URL.replace('{imageId}', imageId);
    const url = `${baseUrl}${downloadUrl}`;
    
    console.log("⬇️ Image Service - Downloading image:", imageId);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to download image'}`);
    }
    
    // Get the blob from the response
    const blob = await response.blob();
    
    // Create a temporary URL for the blob
    const blobUrl = window.URL.createObjectURL(blob);
    
    return { blobUrl, blob };
  } catch (error) {
    console.error("Error downloading image:", error);
    return { error: error.message };
  }
};

export const updateImageMetadata = async (token, imageId, metadata) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const updateUrl = `${baseUrl}/api/images/${imageId}`;
    
    console.log("✏️ Image Service - Updating image metadata:", imageId);
    
    const response = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to update image'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating image metadata:", error);
    return { error: error.message };
  }
};

export const getImageTags = async (token) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const tagsUrl = `${baseUrl}/api/images/tags`;
    
    console.log("🏷️ Image Service - Fetching image tags");
    
    const response = await fetch(tagsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch tags'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching image tags:", error);
    return { error: error.message };
  }
};
