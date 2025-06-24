import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LayoutUser from './components/LayoutUser';
import LayoutUserProfile from './components/LayoutUserProfile';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Principal from './pages/Principal';
import UserProfile from './pages/UserProfile'
import WeeklyChallenges from './pages/WeeklyChallenge';
import Activities from './pages/Activities';
import UserBadges from './pages/UserBadges';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      {/* Ruta principal con layout propio */}
      <Route path="/principal" element={<LayoutUser><Principal /></LayoutUser>} />
      <Route path="/user_profile" element={<LayoutUserProfile><UserProfile /></LayoutUserProfile>} />
      <Route path="/weekly_challenges" element={<LayoutUserProfile><WeeklyChallenges /></LayoutUserProfile>} />
      <Route path="/activities" element={<LayoutUserProfile><Activities/></LayoutUserProfile>} />
      <Route path="/user_badges" element={<LayoutUserProfile><UserBadges/></LayoutUserProfile>} />

        {/* Rutas públicas con layout general */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
