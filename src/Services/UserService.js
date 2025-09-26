// User Service for managing users (Super Admin only)

export const getAllUsers = async (token) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseUrl}/api/users`;
    
    console.log("👥 User Service - Fetching all users from:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch users'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return { error: error.message };
  }
};

export const getUserById = async (token, userId) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseUrl}/api/users/${userId}`;
    
    console.log("👤 User Service - Fetching user by ID from:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch user'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return { error: error.message };
  }
};

export const createUser = async (token, userData) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseUrl}/api/users`;
    
    console.log("➕ User Service - Creating user:", userData.username);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to create user'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: error.message };
  }
};

export const updateUser = async (token, userId, userData) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseUrl}/api/users/${userId}`;
    
    console.log("✏️ User Service - Updating user:", userId);
    
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to update user'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: error.message };
  }
};

export const deleteUser = async (token, userId) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseUrl}/api/users/${userId}`;
    
    console.log("🗑️ User Service - Deleting user:", userId);
    
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to delete user'}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: error.message };
  }
};