
export const ChatService = async (payload, token) => {

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const chatUrl = import.meta.env.VITE_CHAT_ASSISTANT_URL || '/api/chat/assistant';
    const url = `${baseUrl}${chatUrl}`;
    
    // console.log('=== CHAT SERVICE DEBUG ===');
    // console.log('Base URL:', baseUrl);
    // console.log('Chat URL:', chatUrl);
    // console.log('Full URL:', url);
    // console.log('Payload:', payload);
    // console.log('Token present:', !!token);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    // console.log('Response status:', response.status);
    // console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Chat service error:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to get response'}`);
    }
    
    const data = await response.json();
    // console.log('Chat service response:', data);
    return data;
  
  } catch (err) {
    console.error("Error getting response from chat service:", err);
    return { error: err.message };
  }
};

export const ChatHistory = async (token, userId) => {
    // console.log(token);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    // Force the correct endpoint
    const historyUrl = '/chat/history';
    let url = `${baseUrl}${historyUrl}`;
    if (userId) {
      url += `?userId=${userId}`;
    }
    try{
        const response = await fetch(url, {
        method : "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      // console.log('Chat history response status:', response.status);
      // console.log('Chat history response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Chat history error:', response.status, errorText);
        throw new Error(`Failed to fetch chat history: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      // console.log('Chat history data:', data);
      return data;
    }
    catch(error){
      console.error("Error getting chat history of user:", error);
      return { error: error.message };
    }
    
}


export const ChatMessageHistory = async (sessionId, token, page = 0, size = 20) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  const messagesUrl = import.meta.env.VITE_CHAT_MESSAGES_URL || '/chat/{sessionId}/messages';
  const url = `${baseUrl}${messagesUrl.replace('{sessionId}', sessionId)}`;

  const pageDTO = {
    page,
    size
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(pageDTO) // send page info in body
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch chat messages: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching chat messages:", err);
    return { error: err.message };
  }
};

  export const CreateNewSession = async (token) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const createSessionUrl = import.meta.env.VITE_CHAT_CREATE_SESSION_URL || '/chat/create/session';
    const url = `${baseUrl}${createSessionUrl}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.status}`);
      }

      // since backend returns plain String
      const sessionId = await response.text(); 
      return { sessionId };

    } catch (error) {
      console.error("Error creating new session:", error);
      return { error: error.message };
    }
  };

  export async function DeleteChatSession(sessionId, token) {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const deleteSessionUrl = import.meta.env.VITE_CHAT_DELETE_SESSION_URL || '/chat/delete/session/{sessionId}';
    const url = `${baseUrl}${deleteSessionUrl.replace('{sessionId}', sessionId)}`;
    
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete session: ${response.status}`);
    }

    return await response.text(); // "Chat session deleted successfully"
  } catch (error) {
    console.error("Error deleting chat session:", error);
    throw error;
  }
}

export async function UpdateChatTitle(sessionId, newTitle, token) {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const updateTitleUrl = import.meta.env.VITE_CHAT_UPDATE_TITLE_URL || '/chat/update/title/{sessionId}';
    const url = `${baseUrl}${updateTitleUrl.replace('{sessionId}', sessionId)}?title=${encodeURIComponent(newTitle)}`;
    
    const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update title: ${response.status}`);
    }

    return await response.text(); // "Title updated successfully"
  } catch (error) {
    console.error("Error updating chat title:", error);
    throw error;
  }
}

