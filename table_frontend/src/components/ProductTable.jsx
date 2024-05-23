import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Button, TextField, Modal, TablePagination } from '@mui/material';
import '../index.css';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [filteredProductId, setFilteredProductId] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newProductModalOpen, setNewProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedProductData, setEditedProductData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    quantity: ''
  });
  const [newProductData, setNewProductData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api2/products');
        console.log('API Response:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`/api2/products/${productId}`);
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditedProductData(product);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setEditedProductData({
      id: '',
      name: '',
      description: '',
      price: '',
      quantity: ''
    });
    setEditModalOpen(false);
  };

  const handleProductUpdate = async () => {
    try {
      await axios.put(`/api2/products/${editedProductData.id}`, editedProductData);
      setProducts(products.map(product => product.id === editedProductData.id ? editedProductData : product));
      closeEditModal();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleFilterProducts = () => {
    if (!Array.isArray(products)) {
      console.error('Products is not an array:', products);
      return;
    }

    if (filteredProductId.trim() !== '') {
      const filtered = products.filter(product => product.id === parseInt(filteredProductId, 10));
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNewProductModalOpen = () => {
    setNewProductModalOpen(true);
  };

  const handleNewProductModalClose = () => {
    setNewProductModalOpen(false);
    setNewProductData({
      name: '',
      description: '',
      price: '',
      quantity: ''
    });
  };

  const handleAddProduct = async () => {
    try {
      const response = await axios.post('/api2/products', newProductData);
      setProducts([...products, response.data]);
      handleNewProductModalClose();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const paginatedProducts = Array.isArray(filteredProducts) && filteredProducts.length > 0
    ? filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      <h1>Lista de Productos</h1>
      <div className="filter-section">
        <h2>Filtrar por ID</h2>
        <TextField
          label="ID"
          variant="outlined"
          value={filteredProductId}
          onChange={(e) => setFilteredProductId(e.target.value)}
        />
        <Button onClick={handleFilterProducts} variant="contained" color="primary">
          Filtrar
        </Button>
        <Button onClick={handleNewProductModalOpen} variant="contained" color="primary">
          Agregar Nuevo Producto
        </Button>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map(product => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDeleteProduct(product.id)} variant="contained" color="secondary">
                    Eliminar
                  </Button>
                  <Button onClick={() => openEditModal(product)} variant="contained" color="primary">
                    Actualizar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredProducts.length > 0 ? filteredProducts.length : products.length}
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
          <h2 id="modal-title">Editar Producto</h2>
          <TextField
            label="Nombre"
            variant="outlined"
            value={editedProductData.name}
            onChange={(e) => setEditedProductData({ ...editedProductData, name: e.target.value })}
          />
          <TextField
            label="Descripción"
            variant="outlined"
            value={editedProductData.description}
            onChange={(e) => setEditedProductData({ ...editedProductData, description: e.target.value })}
          />
          <TextField
            label="Precio"
            variant="outlined"
            value={editedProductData.price}
            onChange={(e) => setEditedProductData({ ...editedProductData, price: e.target.value })}
          />
          <TextField
            label="Cantidad"
            variant="outlined"
            value={editedProductData.quantity}
            onChange={(e) => setEditedProductData({ ...editedProductData, quantity: e.target.value })}
          />
          <Button onClick={handleProductUpdate} variant="contained" color="primary">
            Guardar Cambios
          </Button>
          <Button onClick={closeEditModal} variant="contained" color="secondary">
            Cancelar
          </Button>
        </div>
      </Modal>
      <Modal
        open={newProductModalOpen}
        onClose={handleNewProductModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal">
          <h2 id="modal-title">Agregar Nuevo Producto</h2>
          <TextField
            label="Nombre"
            variant="outlined"
            value={newProductData.name}
            onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
          />
          <TextField
            label="Descripción"
            variant="outlined"
            value={newProductData.description}
            onChange={(e) => setNewProductData({ ...newProductData, description: e.target.value })}
          />
          <TextField
            label="Precio"
            variant="outlined"
            value={newProductData.price}
            onChange={(e) => setNewProductData({ ...newProductData, price: e.target.value })}
          />
          <TextField
            label="Cantidad"
            variant="outlined"
            value={newProductData.quantity}
            onChange={(e) => setNewProductData({ ...newProductData, quantity: e.target.value })}
          />
          <Button onClick={handleAddProduct} variant="contained" color="primary">
            Agregar Producto
          </Button>
          <Button onClick={handleNewProductModalClose} variant="contained" color="secondary">
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductTable;
