import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import TabNav from './components/TabNav'
import Shop from './components/Shop'
import Cart from './components/Cart'
import Toast from './components/Toast'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import KeepAlive from './pages/KeepAlive'

function App() {
  const [activeTab, setActiveTab] = useState('shop')
  const [cart, setCart] = useState([])
  const [toast, setToast] = useState({ show: false, message: '' })
  const [isAdmin, setIsAdmin] = useState(false)

  const showToast = (message) => {
    setToast({ show: true, message })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id)
    
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
    
    showToast('Added to Cart!')
  }

  const updateQuantity = (index, change) => {
    const newCart = [...cart]
    newCart[index].quantity += change
    
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1)
    }
    
    setCart(newCart)
  }

  const checkout = () => {
    showToast('Order placed successfully! 🎉')
    setCart([])
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/keepalive" element={<KeepAlive />} />
        <Route path="/admin/login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
        <Route 
          path="/admin" 
          element={
            isAdmin ? (
              <AdminDashboard showToast={showToast} setIsAdmin={setIsAdmin} />
            ) : (
              <Navigate to="/admin/login" />
            )
          } 
        />
        <Route 
          path="/*" 
          element={
            <div className="app">
              <Header 
                cartCount={cartCount} 
                onCartClick={() => setActiveTab('cart')}
              />
              
              <TabNav 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
              />
              
              <main className="main-content">
                {activeTab === 'shop' && <Shop addToCart={addToCart} />}
                {activeTab === 'cart' && (
                  <Cart 
                    cart={cart}
                    updateQuantity={updateQuantity}
                    checkout={checkout}
                  />
                )}
              </main>

              <Toast show={toast.show} message={toast.message} />
            </div>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
