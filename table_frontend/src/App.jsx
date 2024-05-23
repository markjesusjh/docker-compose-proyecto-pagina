import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import NavBar from './NavBar'; 
import UserPage from './pages/UserPage';
import ProductPage from './pages/ProductPage';
import HomePage from './pages/HomePage';
import OrderPage from './pages/OrderPage';
import './styles/App.css'

// Define tu tema
const theme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div>
          <NavBar />
          <Routes>
            <Route path="/users" element={<UserPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
