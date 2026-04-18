import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Analysis from './pages/Analysis';
import Upload from './pages/Upload';
import Benchmarks from './pages/Benchmarks';
import Marketplace from './pages/Marketplace';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-background text-on-surface antialiased overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<Upload />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/benchmarks" element={<Benchmarks />} />
              <Route path="/marketplace" element={<Marketplace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
