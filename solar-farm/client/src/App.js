import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import List from './components/List';
import Nav from './components/Nav';
import Form from './components/Form';
import ConfirmDelete from './components/ConfirmDelete';

function App() {
  // global state
  // pros: Fewer requests to the server, more efficient from an HTTP perspective
  // cons: More complex, stale data

  return (
    <BrowserRouter>
      <h1>Welcome to Solar farm!</h1>
      <Nav />

      <Routes>
        <Route path="/" element={<p>Click a link to get started!</p>} />
        <Route path="/list" element={<List />} />
        <Route path="/add" element={<Form />} />
        <Route path="/edit/:id" element={<Form />} />
        <Route path="/delete/:id" element={<ConfirmDelete />} />
        <Route path="*" element={<p>Page not found.</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
