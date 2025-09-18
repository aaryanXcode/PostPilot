export const LinkedInAuthService = async (token) => {
    const url = "http://localhost:8080/linkedin/auth-url";

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
    const url = "http://localhost:8080/linkedin/auth-status";

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
