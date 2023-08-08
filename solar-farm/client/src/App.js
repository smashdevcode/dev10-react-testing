import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ConfirmDelete from './components/ConfirmDelete';
import Header from './components/Header';
import Form from './components/Form';
import List from './components/List';
import Nav from './components/Nav';

function App() {
  return (
    <Router>
      <Header />
      <Nav />
      <Routes>
        <Route path="/" element={<p>Click a link to get started!</p>} />
        <Route path="/list" element={<List />} />
        <Route path="/add" element={<Form />} />
        <Route path="/edit/:id" element={<Form />} />
        <Route path="/delete/:id" element={<ConfirmDelete />} />
        <Route path="*" element={<p>Page not found.</p>} />
      </Routes>
    </Router>
  );
}

export default App;
