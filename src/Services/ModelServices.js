export const ModelService = async () =>{
    try{
        const url  = "http://localhost:8080/chat/models"
        const response = await fetch(url, {
            method : "GET",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" :  `Bearer ${token}`,

            },
        });
        if (!response.ok) {
        const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to get Models list'}`);
        }
        
        const data = await response.json();
        return data;
    }
    catch(error){
        console.error("Error getting response from chat service:", err);
        return { error: err.message };
    }
}