const AuthService = async ({ username, password }) => {
    console.log({username,password});
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const loginUrl = import.meta.env.VITE_AUTH_LOGIN_URL || '/api/auth/login';
    const response = await fetch(`${baseUrl}${loginUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error during login:", err);
    return { error: err.message };
  }
};

const GetProfile = async (token) =>{
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const profileUrl = import.meta.env.VITE_USER_PROFILE_URL;
  const url = `${baseUrl}${profileUrl}`;
  const response = await fetch(url, {
    method : "GET",
    headers : {
      "Content-Type" : "application/json",
      "Authorization" : `Bearer ${token}`,
    }

  })
  const data = response.json();
  console.log(await data);
}

export {AuthService, GetProfile};
