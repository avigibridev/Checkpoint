const API_BASE = "http://localhost:8080"; // Adjust based on backend

export const fetchUsers = async () => {
    const response = await fetch(`${API_BASE}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
};

export const createUser = async (user) => {
    const response = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });

    if (!response.ok) throw new Error("Failed to create user");
    return await response.text();
};

export const deleteUser = async (id) => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete user");
    return await response.text();
};

export const checkStatus = async (operationId) => {
    const response = await fetch(`${API_BASE}/status/${operationId}`);
    if (!response.ok) throw new Error("Failed to check status");
    return await response.text();
};
