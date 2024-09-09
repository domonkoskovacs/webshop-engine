import React from 'react';
import {Routes, Route } from 'react-router-dom';
import Home from './components/Home.component';
import NotFound from './components/NotFound.component';

function App() {
  return (
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </div>
  );
}

export default App;
