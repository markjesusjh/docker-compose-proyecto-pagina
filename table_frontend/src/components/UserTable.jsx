import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField } from '@mui/material';
import '../index.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUserId, setFilteredUserId] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editedUserData, setEditedUserData] = useState({
    id: '',
    firstname: '',
    lastname: '',
    gender: '',
    age: '',
    phone: '',
    address: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    firstname: '',
    lastname: '',
    gender: '',
    age: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api1/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/api1/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditedUserData(user);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditedUserData({
      id: '',
      firstname: '',
      lastname: '',
      gender: '',
      age: '',
      phone: '',
      address: ''
    });
    setEditModalOpen(false);
  };

  const handleUserUpdate = async () => {
    try {
      await axios.put(`/api1/users/${editedUserData.id}`, editedUserData);
      setUsers(users.map(user => user.id === editedUserData.id ? editedUserData : user));
      closeEditModal();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleFilterUsers = () => {
    if (filteredUserId.trim() !== '') {
      const filtered = users.filter(user => user.id === parseInt(filteredUserId));
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  };

  const handleChangePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedUsers = (filteredUsers.length > 0 ? filteredUsers : users).slice(startIndex, endIndex);

  const handleNewUserModalOpen = () => {
    setNewUserModalOpen(true);
  };

  const handleNewUserModalClose = () => {
    setNewUserModalOpen(false);
  };

  const handleAddUser = async () => {
    try {
      const response = await axios.post('/api1/users', newUserData);
      setUsers([...users, response.data]);
      setNewUserData({
        firstname: '',
        lastname: '',
        gender: '',
        age: '',
        phone: '',
        address: ''
      });
      setNewUserModalOpen(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className="App">
      <h1>Lista de Usuarios</h1>
      <div>
        <TextField
          label="Filtrar por ID"
          variant="outlined"
          value={filteredUserId}
          onChange={(e) => setFilteredUserId(e.target.value)}
        />
        <Button onClick={handleFilterUsers} variant="contained" color="primary">
          Filtrar
        </Button>
      </div>
      <Button onClick={handleNewUserModalOpen} variant="contained" color="primary">Agregar Nuevo Usuario</Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Género</TableCell>
              <TableCell>Edad</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.firstname}</TableCell>
                <TableCell>{user.lastname}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDeleteUser(user.id)} variant="contained" color="secondary">
                    Eliminar
                  </Button>
                  <Button onClick={() => openEditModal(user)} variant="contained" color="primary">
                    Actualizar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="pagination">
        <Button disabled={currentPage === 1} onClick={() => handleChangePage(currentPage - 1)}>Anterior</Button>
        {Array.from({ length: Math.ceil((filteredUsers.length > 0 ? filteredUsers.length : users.length) / pageSize) }, (_, index) => (
          <Button key={index} onClick={() => handleChangePage(index + 1)}>{index + 1}</Button>
        ))}
        <Button disabled={currentPage === Math.ceil((filteredUsers.length> 0 ? filteredUsers.length : users.length) / pageSize)} onClick={() => handleChangePage(currentPage + 1)}>Siguiente</Button>
      </div>
      {/* Modal de edición */}
      <Modal
        open={editModalOpen}
        onClose={closeEditModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal">
          <h2 id="modal-title">Editar Usuario</h2>
          <TextField
            label="Nombre"
            variant="outlined"
            value={editedUserData.firstname}
            onChange={(e) => setEditedUserData({ ...editedUserData, firstname: e.target.value })}
          />
          <TextField
            label="Apellido"
            variant="outlined"
            value={editedUserData.lastname}
            onChange={(e) => setEditedUserData({ ...editedUserData, lastname: e.target.value })}
          />
          <TextField
            label="Género"
            variant="outlined"
            value={editedUserData.gender}
            onChange={(e) => setEditedUserData({ ...editedUserData, gender: e.target.value })}
          />
          <TextField
            label="Edad"
            variant="outlined"
            value={editedUserData.age}
            onChange={(e) => setEditedUserData({ ...editedUserData, age: e.target.value })}
          />
          <TextField
            label="Teléfono"
            variant="outlined"
            value={editedUserData.phone}
            onChange={(e) => setEditedUserData({ ...editedUserData, phone: e.target.value })}
          />
          <TextField
            label="Dirección"
            variant="outlined"
            value={editedUserData.address}
            onChange={(e) => setEditedUserData({ ...editedUserData, address: e.target.value })}
          />
          <Button onClick={handleUserUpdate} variant="contained" color="primary">
            Guardar Cambios
          </Button>
          <Button onClick={closeEditModal} variant="contained" color="secondary">
            Cancelar
          </Button>
        </div>
      </Modal>
      {/* Modal de nuevo usuario */}
      <Modal
        open={newUserModalOpen}
        onClose={handleNewUserModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal">
          <h2 id="modal-title">Agregar Nuevo Usuario</h2>
          <TextField
            label="Nombre"
            variant="outlined"
            value={newUserData.firstname}
            onChange={(e) => setNewUserData({ ...newUserData, firstname: e.target.value })}
          />
          <TextField
            label="Apellido"
            variant="outlined"
            value={newUserData.lastname}
            onChange={(e) => setNewUserData({ ...newUserData, lastname: e.target.value })}
          />
          <TextField
            label="Género"
            variant="outlined"
            value={newUserData.gender}
            onChange={(e) => setNewUserData({ ...newUserData, gender: e.target.value })}
          />
          <TextField
            label="Edad"
            variant="outlined"
            value={newUserData.age}
            onChange={(e) => setNewUserData({ ...newUserData, age: e.target.value })}
          />
          <TextField
            label="Teléfono"
            variant="outlined"
            value={newUserData.phone}
            onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
          />
          <TextField
            label="Dirección"
            variant="outlined"
            value={newUserData.address}
            onChange={(e) => setNewUserData({ ...newUserData, address: e.target.value })}
          />
          <Button onClick={handleAddUser} variant="contained" color="primary">
            Agregar Usuario
          </Button>
          <Button onClick={handleNewUserModalClose} variant="contained" color="secondary">
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default UserTable;

