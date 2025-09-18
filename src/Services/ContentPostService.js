export const PostContent = async (generatedContent, token) => {
    console.log(JSON.stringify(generatedContent), token);
    const url = "http://localhost:8080/content/post";
    
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
    const url = "http://localhost:8080/content/schedule";
    
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





