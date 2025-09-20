export const PostContent = async (generatedContent, token) => {
    console.log(JSON.stringify(generatedContent), token);
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const postContentUrl = import.meta.env.VITE_CONTENT_POST_URL;
    const url = `${baseUrl}${postContentUrl}`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(generatedContent)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to post content'}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) { 
        console.error("Error posting content:", error); 
        return { error: error.message };
    }
}

export const PostSchedule = async (scheduleObject, token) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const scheduleUrl = import.meta.env.VITE_CONTENT_SCHEDULE_URL;
    const url = `${baseUrl}${scheduleUrl}`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(scheduleObject)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to post content'}`);
        }
      
        const data = await response.text();
        return data;
    } catch (error) { 
        console.error("Error posting content:", error); 
        return { error: error.message };
    }
}


export const UpdatePostContent = async (generatedContent, token) => {
    console.log(JSON.stringify(generatedContent), token);
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const contentUpdate = import.meta.env.VITE_CONTENT_UPDATE_URL
    const url = `${baseUrl}${contentUpdate}`;
    console.log(url);
    console.log("Sending token:", token);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(generatedContent.content)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to post content'}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) { 
        console.error("Error posting content:", error); 
        return { error: error.message };
    }
}



