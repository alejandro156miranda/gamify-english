// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import LayoutUser from './components/LayoutUser';
import LayoutUserProfile from './components/LayoutUserProfile';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';

import Principal from './pages/Principal';
import Activities from './pages/Activities';
import WeeklyChallenges from './pages/WeeklyChallenge';
import UserBadges from './pages/UserBadges';
import UserProfile from './pages/UserProfile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas públicas */}
        <Route element={<Layout />}>
          <Route path="/"        element={<Home />} />
          <Route path="/register"element={<Register />} />
          <Route path="/login"   element={<Login />} />
        </Route>

        {/* Principal con LayoutUser */}
        <Route path="/principal" element={<LayoutUser><Principal/></LayoutUser>} />

        {/* Rutas de usuario (perfil, actividades, etc.) */}
        <Route element={<LayoutUserProfile />}>
          <Route path="/activities"        element={<Activities />} />
          <Route path="/weekly_challenges" element={<WeeklyChallenges />} />
          <Route path="/user_badges"       element={<UserBadges />} />
          <Route path="/user_profile"      element={<UserProfile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
