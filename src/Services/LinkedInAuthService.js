export const LinkedInAuthService = async (token) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const linkedinAuthUrl = import.meta.env.VITE_LINKEDIN_AUTH_URL || '/linkedin/auth-url';
    const url = `${baseUrl}${linkedinAuthUrl}`;
    console.log(url);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText || "Failed to fetch LinkedIn auth URL"}`);
        }

        const data = await response.json();
        // Backend should return something like: { authUrl: "https://www.linkedin.com/oauth/v2/authorization?..." }

        if (data?.authUrl) {
            window.location.href = data.authUrl; // 🔑 Redirect user to LinkedIn
        } else {
            throw new Error("Auth URL not found in response");
        }
    } catch (error) {
        console.error("Error fetching LinkedIn auth URL:", error);
        return { error: error.message };
    }
};


export const LinkedInAuthStatusService = async (token) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const linkedinAuthStatusUrl = import.meta.env.VITE_LINKEDIN_AUTH_STATUS_URL || '/linkedin/auth-status';
    const url = `${baseUrl}${linkedinAuthStatusUrl}`;
    console.log(url);
    
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText || "Failed to fetch auth status"}`);
        }

        const data = await response.json();
        // Example: { authenticated: true, hasToken: true }
        return data;
    } catch (error) {
        console.error("Error fetching LinkedIn auth status:", error);
        return { error: error.message, authenticated: false, hasToken: false };
    }
};
