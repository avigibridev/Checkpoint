import React, { useState, useEffect, useCallback } from "react";
import { fetchUsers, createUser, deleteUser, checkStatus } from "../apis/usersApi";
import "./UsersTable.css"; // External CSS for styling
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import styles for toast

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [touched, setTouched] = useState({ firstName: false, lastName: false, email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true); // Track if users are being loaded

  const loadUsersWithRetry = useCallback(async (attempt = 1, delay = 2000) => {
    try {
      const data = await fetchUsers();
      setUsers(data.map(user => ({ ...user, loading: false }))); // Add 'loading' flag to each user
      setLoadingUsers(false); // Set loading state to false once users are loaded
    } catch (error) {
      console.error(`Attempt ${attempt}: Error fetching users`, error);
      if (attempt < 2) {
        setTimeout(() => loadUsersWithRetry(attempt + 1, delay * 2), delay); // Exponential backoff
      } else {
        toast.error("Server issues while loading users!"); // Show toast message
        setLoadingUsers(false); // Stop loading after failure
      }
    }
  }, []);

  useEffect(() => {
    console.log("useEffect called");
    loadUsersWithRetry();
  }, [loadUsersWithRetry]);

  const handleCreateUser = async () => {
    setLoading(true);
    try {
      const operationId = await createUser(newUser);
      pollStatus(operationId);
      setNewUser({ firstName: "", lastName: "", email: "", password: "" });
      setTouched({ firstName: false, lastName: false, email: false, password: false }); // Reset touched state
      toast.success("User created successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || "Error creating user!"); // Show backend message or default message
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    setUsers(prevUsers =>
      prevUsers.map(user => (user.id === id ? { ...user, loading: true } : user))
    );

    try {
      const operationId = await deleteUser(id);
      await pollStatus(operationId);
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || "Error deleting user!");
    } finally {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    }
  };

  const pollStatus = async (operationId) => {
    let status = "Processing";
    let delay = 2000;

    const delayPromise = (time) => new Promise(resolve => setTimeout(resolve, time));

    while (status === "Processing") {
      try {
        status = await checkStatus(operationId);
        if (status !== "Processing") break;
        await delayPromise(delay);
        delay *= 2;
      } catch (error) {
        console.error("Error checking status", error);
        break;
      }
    }
    await loadUsersWithRetry();
  };

  const isFormValid = () => {
    return (
      newUser.firstName &&
      newUser.lastName &&
      newUser.email &&
      newUser.password &&
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(newUser.email)
    );
  };

  const getErrorMessage = (field) => {
    if (!newUser[field] && touched[field]) {
      return `${field} is required.`;
    }

    if (field === "password" && touched[field] && newUser.password.length < 6) {
      return "Password min of 6 characters required";
    }

    if (field === "email" && touched[field] && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(newUser.email)) {
      return "Invalid email format.";
    }
    return "";
  };

  const renderTableContent = () => {
    if (loadingUsers) {
      return <p>Loading users...</p>;
    } else if (users.length === 0) {
      return <p>No users available</p>;
    } else {
      return (
        <table className="users-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="delete-btn"
                    disabled={user.loading}
                  >
                    {user.loading ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div className="users-table-container">
      {renderTableContent()}

      <h3>Add New User</h3>
      <div className="form-container">
        <input
          type="text"
          placeholder="First Name"
          value={newUser.firstName}
          onChange={e => setNewUser({ ...newUser, firstName: e.target.value })}
          onBlur={() => setTouched({ ...touched, firstName: true })} // Mark as touched on blur
        />
        {getErrorMessage("firstName") && <div className="error">{getErrorMessage("firstName")}</div>}

        <input
          type="text"
          placeholder="Last Name"
          value={newUser.lastName}
          onChange={e => setNewUser({ ...newUser, lastName: e.target.value })}
          onBlur={() => setTouched({ ...touched, lastName: true })} // Mark as touched on blur
        />
        {getErrorMessage("lastName") && <div className="error">{getErrorMessage("lastName")}</div>}

        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={e => setNewUser({ ...newUser, email: e.target.value })}
          onBlur={() => setTouched({ ...touched, email: true })} // Mark as touched on blur
        />
        {getErrorMessage("email") && <div className="error">{getErrorMessage("email")}</div>}

        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={e => setNewUser({ ...newUser, password: e.target.value })}
          onBlur={() => setTouched({ ...touched, password: true })} // Mark as touched on blur
        />
        {getErrorMessage("password") && <div className="error">{getErrorMessage("password")}</div>}

        <button
          onClick={handleCreateUser}
          className="add-user-btn"
          disabled={loading || !isFormValid()} // Disable button if form is not valid
        >
          {loading ? "Adding..." : "Add User"}
        </button>
      </div>
    </div>
  );
};

export default UsersTable;
