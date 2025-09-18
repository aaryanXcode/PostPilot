
export const ChatService = async (payload, token) => {

  try {
    const url = "http://localhost:8080/chat/assistant";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to get response'}`);
    }
    
    const data = await response.json();
    return data;
  
  } catch (err) {
    console.error("Error getting response from chat service:", err);
    return { error: err.message };
  }
};

export const ChatHistory = async (token, userId) => {
    let url = "http://localhost:8080/user/chat_history";
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

      if (!response.ok) {
        throw new Error(`Failed to fetch chat history: ${response.status}`);
      }

      const data = await response.json();
      return data;
    }
    catch(error){
      console.error("Error getting chat history of user:", err);
      return { error: err.message };
    }
    
}


export const ChatMessageHistory = async (sessionId, token, page = 0, size = 20) => {
  const url = `http://localhost:8080/chat/${sessionId}/messages`;

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
    const url = "http://localhost:8080/chat/create/session";

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
    const response = await fetch(
      `http://localhost:8080/chat/delete/session/${sessionId}`,
      {
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
    const response = await fetch(
      `http://localhost:8080/chat/update/title/${sessionId}?title=${encodeURIComponent(newTitle)}`,
      {
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

