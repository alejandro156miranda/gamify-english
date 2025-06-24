import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LayoutUser from './components/LayoutUser';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Principal from './pages/Principal';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

      <Route path="/principal" element={<LayoutUser><Principal /></LayoutUser>} />
        {/* Rutas públicas con layout general */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Ruta principal con layout de usuario */}
        

      </Routes>
    </BrowserRouter>
  );
}
