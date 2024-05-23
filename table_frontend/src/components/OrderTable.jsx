import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField, TablePagination } from '@mui/material';
import '../index.css';

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newOrderModalOpen, setNewOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editedOrderData, setEditedOrderData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    order_date: ''
  });
  const [newOrderData, setNewOrderData] = useState({
    first_name: '',
    last_name: '',
    order_date: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredOrderId, setFilteredOrderId] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api3/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`/api3/orders/${id}`);
      setOrders(orders.filter(order => order.id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const openEditModal = (order) => {
    setEditingOrder(order);
    setEditedOrderData(order);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingOrder(null);
    setEditedOrderData({
      id: '',
      first_name: '',
      last_name: '',
      order_date: ''
    });
    setEditModalOpen(false);
  };

  const handleOrderUpdate = async () => {
    try {
      await axios.put(`/api3/orders/${editedOrderData.id}`, editedOrderData);
      setOrders(orders.map(order => order.id === editedOrderData.id ? editedOrderData : order));
      closeEditModal();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleNewOrderModalOpen = () => {
    setNewOrderModalOpen(true);
  };

  const handleNewOrderModalClose = () => {
    setNewOrderModalOpen(false);
    setNewOrderData({
      first_name: '',
      last_name: '',
      order_date: ''
    });
  };

  const handleAddOrder = async () => {
    try {
      const response = await axios.post('/api3/orders', newOrderData);
      setOrders([...orders, response.data]);
      handleNewOrderModalClose();
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterOrders = () => {
    if (filteredOrderId.trim() !== '') {
      const filtered = orders.filter(order => order.id === parseInt(filteredOrderId, 10));
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders([]);
    }
  };

  const paginatedOrders = filteredOrders.length > 0 ? filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      <h1>Lista de Pedidos</h1>
      <div>
        <TextField
          label="Filtrar por ID"
          variant="outlined"
          value={filteredOrderId}
          onChange={(e) => setFilteredOrderId(e.target.value)}
        />
        <Button onClick={handleFilterOrders} variant="contained" color="primary">
          Filtrar
        </Button>
        <Button onClick={handleNewOrderModalOpen} variant="contained" color="primary">
          Agregar Nuevo Pedido
        </Button>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.first_name}</TableCell>
                <TableCell>{order.last_name}</TableCell>
                <TableCell>{order.order_date}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDeleteOrder(order.id)} variant="contained" color="secondary">
                    Eliminar
                  </Button>
                  <Button onClick={() => openEditModal(order)} variant="contained" color="primary">
                    Actualizar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredOrders.length > 0 ? filteredOrders.length : orders.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Modal
        open={editModalOpen}
        onClose={closeEditModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal">
          <h2 id="modal-title">Edit Order</h2>
          <TextField
            label="First Name"
            variant="outlined"
            value={editedOrderData.first_name}
            onChange={(e) => setEditedOrderData({ ...editedOrderData, first_name: e.target.value })}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            value={editedOrderData.last_name}
            onChange={(e) => setEditedOrderData({ ...editedOrderData, last_name: e.target.value })}
          />
          <TextField
            label="Order Date"
            variant="outlined"
            value={editedOrderData.order_date}
            onChange={(e) => setEditedOrderData({ ...editedOrderData, order_date: e.target.value })}
          />
          <Button onClick={handleOrderUpdate} variant="contained" color="primary">
            Save Changes
          </Button>
          <Button onClick={closeEditModal} variant="contained" color="secondary">
            Cancel
          </Button>
        </div>
      </Modal>
      <Modal
        open={newOrderModalOpen}
        onClose={handleNewOrderModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal">
          <h2 id="modal-title">Agregar Nuevo Pedido</h2>
          <TextField
            label="First Name"
            variant="outlined"
            value={newOrderData.first_name}
            onChange={(e) => setNewOrderData({ ...newOrderData, first_name: e.target.value })}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            value={newOrderData.last_name}
            onChange={(e) => setNewOrderData({ ...newOrderData, last_name: e.target.value })}
          />
          <TextField
            label="Order Date"
            variant="outlined"
            value={newOrderData.order_date}
            onChange={(e) => setNewOrderData({ ...newOrderData, order_date: e.target.value })}
          />
          <Button onClick={handleAddOrder} variant="contained" color="primary">
            Agregar Pedido
          </Button>
          <Button onClick={handleNewOrderModalClose} variant="contained" color="secondary">
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default OrderTable;
