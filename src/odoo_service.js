import urls from "../url";

const authenticateUser = async (username, password, login_url) => {
    const login = login_url + urls.login
    if (username && username.toLowerCase() === username) {
        username = username.toUpperCase();
    }
    try {
        const response = await fetch(login, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: "call",
                params: {
                    username,password
                },
            }),
        });
        if (!response.ok) {
            return false;
        }
        const data = await response.json();
        return data?.result?.message === "Login successful";
    } catch (error) {
        throw new Error('Unable to connect to the server. Please try again.');
    }
};

export { authenticateUser };
