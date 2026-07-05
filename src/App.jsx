import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddContact from './pages/AddContact';
import Scan from './pages/Scan';
import ContactDetail from './pages/ContactDetail';
import Profile from './pages/Profile';
import About from './pages/About';
import BottomNav from './components/BottomNav';
import SplashScreen from './components/SplashScreen';

function App() {
  return (
    <BrowserRouter>
      <SplashScreen />
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddContact />} />
          <Route path="/edit/:id" element={<AddContact />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/contact/:id" element={<ContactDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
