import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // You'll create this
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NewTrip from './pages/NewTrip';
import EditTrip from './pages/EditTrip';
import PrivateRoute from './components/PrivateRoute'; // You'll create this

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="" element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trip/new" element={<NewTrip />} />
            <Route path="/trip/edit/:id" element={<EditTrip />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}
export default App;