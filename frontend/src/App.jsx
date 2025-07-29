// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import LayoutUser from './components/LayoutUser';
import LayoutUserProfile from './components/LayoutUserProfile';
import AdminLayout from './components/AdminLayout';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';

import Principal from './pages/Principal';
import Activities from './pages/Activities';
import WeeklyChallenges from './pages/WeeklyChallenge';
import UserBadges from './pages/UserBadges';
import UserProfile from './pages/UserProfile';

import Raffle from './pages/Raffle';               // <-- Nueva página de rifas
import AboutUs from './pages/AboutUs';

import AdminWeeklyActs from './pages/AdminWeeklyActs';
import AdminPanel from './pages/AdminPanel';
import AdminUsers from './pages/AdminUsers';
import AdminActivities from './pages/AdminActivities'; 
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas públicas */}
        <Route element={<Layout />}>
          <Route path="/"         element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login"    element={<Login />} />
        </Route>

        {/* Principal con LayoutUser */}
        <Route
          path="/principal"
          element={<LayoutUser><Principal/></LayoutUser>}
        />

        {/* Rutas de usuario (perfil, actividades, etc.) */}
        <Route element={<LayoutUserProfile />}>
          <Route path="/activities"        element={<Activities />} />
          <Route path="/weekly_challenges" element={<WeeklyChallenges />} />
          <Route path="/user_badges"       element={<UserBadges />} />
          <Route path="/user_profile"      element={<UserProfile />} />
          <Route path="/raffle"            element={<Raffle />} />
        </Route>

        {/* Rutas de administración */}
        <Route element={<AdminLayout />}>
          <Route path="/admin"                       element={<AdminPanel />} />
          <Route path="/admin/users"                 element={<AdminUsers />} />
          <Route path="/admin/activities"                 element={<AdminActivities />} />
          <Route path="/admin/weekly-challenges"     element={<AdminWeeklyActs />} />
        </Route>

        {/* Nueva ruta para Sobre Nosotros */}
        <Route
          path="/nosotros"
          element={<LayoutUser><AboutUs/></LayoutUser>}
        />

      </Routes>
    </BrowserRouter>
  );
}
