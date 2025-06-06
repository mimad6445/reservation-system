import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import MyReservations from './pages/MyReservations';
import CreateProduct from './pages/CreateProduct';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<Products />} />
      <Route path="/my-reservations" element={<MyReservations />} />
      <Route path="/add-product" element={<CreateProduct />} />
    </Routes>
  );
}

export default App;