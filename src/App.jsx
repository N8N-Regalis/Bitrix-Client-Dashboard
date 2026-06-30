import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ContactsDashboard } from './pages/ContactsDashboard';
import { ClientAssignments } from './pages/ClientAssignments';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ContactsDashboard />} />
          <Route path="/contacts" element={<ContactsDashboard />} />
          <Route path="/assignments" element={<ClientAssignments />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
