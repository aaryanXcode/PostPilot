const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const createUser = async (userData, token) => {
  try {
    // console.log("=== FRONTEND: Creating User ===");
    // console.log("User data:", userData);
    // console.log("API URL:", `${baseUrl}/api/users`);
    
    const response = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    // console.log("Response status:", response.status);
    // console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to create user'}`);
    }

    const data = await response.json();
    // console.log("User created successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: error.message };
  }
};

export const getAllUsers = async (token) => {
  try {
    // console.log("=== FRONTEND: Fetching All Users ===");
    // console.log("API URL:", `${baseUrl}/api/users`);
    
    const response = await fetch(`${baseUrl}/api/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch users'}`);
    }

    const data = await response.json();
    // console.log("Users fetched successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: error.message };
  }
};

export const getUserById = async (id, token) => {
  try {
    // console.log("=== FRONTEND: Fetching User by ID ===");
    // console.log("User ID:", id);
    // console.log("API URL:", `${baseUrl}/api/users/${id}`);
    
    const response = await fetch(`${baseUrl}/api/users/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch user'}`);
    }

    const data = await response.json();
    // console.log("User fetched successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, error: error.message };
  }
};
