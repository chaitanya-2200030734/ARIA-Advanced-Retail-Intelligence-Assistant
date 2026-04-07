import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ShopOwnerSignup from './pages/ShopOwnerSignup'
import ShopDashboard from './pages/ShopDashboard'
import AddProduct from './pages/AddProduct'
import ManageProducts from './pages/ManageProducts'
import Dashboard from './pages/Dashboard'
import UserDashboard from './pages/UserDashboard'
import Inventory from './pages/Inventory'
import Sales from './pages/Sales'
import Customers from './pages/Customers'
import Insights from './pages/Insights'
import ShopOwnersManagement from './pages/ShopOwnersManagement'
import DashboardLayout from './components/layout/DashboardLayout'
import UserLayout from './components/layout/UserLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminOnlyRoute from './routes/AdminOnlyRoute'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/shop-owner-signup" element={<ShopOwnerSignup />} />
        <Route path="/shop-dashboard" element={<ShopDashboard />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/shop-manager/products" element={<ManageProducts />} />

        {/* User dashboard routes (no sidebar, just navbar) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
        </Route>

        {/* Admin dashboard routes (with sidebar) */}
        <Route
          path="/admin"
          element={
            <AdminOnlyRoute>
              <DashboardLayout />
            </AdminOnlyRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="sales" element={<Sales />} />
          <Route path="customers" element={<Customers />} />
          <Route path="insights" element={<Insights />} />
          <Route path="shop-owners" element={<ShopOwnersManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
