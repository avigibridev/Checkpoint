import React from 'react';
import UsersTable from './UsersTable/UsersTable';  // Import UsersTable component
import './App.css'; // Assuming you have a separate CSS file for styling
import { ToastContainer } from 'react-toastify'; // Import ToastContainer

const App = () => {
  return (
    <div className="app-container">
      <h1>User Management</h1>
      <UsersTable />
      <ToastContainer />
    </div>
  );
}

export default App;