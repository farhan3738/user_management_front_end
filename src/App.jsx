import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import './App.css';

const API_URL = 'https://user-management-back-end.vercel.app/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const response = await axios.get(API_URL);
    setUsers(response.data.data);
  }

  const handleDialogOpen = (user) => {
    setDialogOpen(true);
    if (user) {
      setEditMode(true);
      setCurrentUserId(user.id);
      setNewUser({ name: user.name, email: user.email });
    } else {
      setEditMode(false);
      setNewUser({ name: '', email: '' });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewUser({ name: '', email: '' });
    setEditMode(false);
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleAddUser = async () => {
    try {
      await axios.post(API_URL, newUser);
      fetchUsers();
      handleDialogClose();
      showMessage('User added successfully!', 'success');
    } catch (error) {
      showMessage(error.response.data.message, 'error');
    }
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`${API_URL}/${currentUserId}`, newUser);
      fetchUsers();
      handleDialogClose();
      showMessage('User updated successfully!', 'success');
    } catch (error) {
      showMessage(error.response.data.message, 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
      showMessage('User deleted successfully!', 'success');
    } catch (error) {
      showMessage(error.response.data.message, 'error');
    }
  };

  return (
    <div className="app-container">
      <h1>User Management</h1>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      {dialogOpen && (
        <div className="dialog">
          <h2>{editMode ? 'Edit User' : 'Add New User'}</h2>
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <div className="dialog-actions">
            <button onClick={handleDialogClose}>Cancel</button>
            <button onClick={editMode ? handleUpdateUser : handleAddUser}>
              {editMode ? 'Update User' : 'Add User'}
            </button>
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleDialogOpen(user)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => handleDialogOpen()} style={{ marginTop: '20px' }}>
        <FontAwesomeIcon icon={faPlus} /> Add New User
      </button>
    </div>
  );
}

export default App;
