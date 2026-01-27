import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import Header from './components/Header';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Summary from './pages/Summary';
import Visuals from './pages/Visuals';

const NavBar = () => {
  const location = useLocation();
  const { data } = useData();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  // Optional: Hide tabs if on Home? Or just show them.
  // Let's show them for easy navigation.

  if (location.pathname === '/') return null; // Maybe hide on landing if we want a specific landing feel. but let's keep it simple.
  // Actually, user requested "Home Page" as a landing.

  return (
    <div className="container no-print">
      <div className="tabs">
        <Link to="/" className={`tab ${isActive('/')}`}>Home</Link>
        <Link to="/analysis" className={`tab ${isActive('/analysis')}`}>Sentiment Analysis</Link>
        <Link to="/summary" className={`tab ${isActive('/summary')}`}>AI Summary</Link>
        <Link to="/visuals" className={`tab ${isActive('/visuals')}`}>Visual Insights</Link>
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div style={{ marginTop: '2rem' }}>
        <NavBar />
        {children}
      </div>
    </>
  );
}

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/visuals" element={<Visuals />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
