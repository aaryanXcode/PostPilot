export const ModelService = async (token) =>{
    try{
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const modelsUrl = import.meta.env.VITE_CHAT_MODELS_URL;
        const url = `${baseUrl}${modelsUrl}`;
        
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
        console.error("Error getting response from chat service:", error);
        return { error: error.message };
    }
}