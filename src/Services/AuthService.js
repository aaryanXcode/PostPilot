const AuthService = async ({ username, password }) => {
    console.log({username,password});
  try {
    const response = await fetch("http://localhost:8080/auth/login", {
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
  const url = "http://localhost:8080/user/profile";
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
