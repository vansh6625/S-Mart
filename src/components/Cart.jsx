import { useState } from 'react'
import CheckoutModal from './CheckoutModal'
import './Cart.css'

function Cart({ cart, updateQuantity, checkout }) {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)

  const handleCheckout = (customerInfo) => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER
    
    // Build order message
    let message = `*New Order from S-Mart*\n\n`
    message += `*Customer Details:*\n`
    message += `Name: ${customerInfo.name}\n`
    message += `Phone: +91${customerInfo.phone}\n`
    message += `Address: ${customerInfo.address}\n\n`
    message += `*Order Items:*\n`
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`
      message += `   Quantity: ${item.quantity}\n`
      message += `   Price: ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}\n\n`
    })
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const delivery = 40
    const total = subtotal + delivery
    
    message += `*Order Summary:*\n`
    message += `Subtotal: ₹${subtotal}\n`
    message += `Delivery: ₹${delivery}\n`
    message += `*Total: ₹${total}*`
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message)
    
    // Open WhatsApp
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
    
    // Close modal and clear cart
    setShowCheckoutModal(false)
    checkout()
  }

  if (cart.length === 0) {
    return (
      <div className="cart-content">
        <h2 className="section-title">Shopping Cart</h2>
        <div className="cart-section">
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some products to get started!</p>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const delivery = 40
  const total = subtotal + delivery

  return (
    <div className="cart-content">
      <h2 className="section-title">Shopping Cart</h2>
      <div className="cart-section">
        <div className="cart-items">
          {cart.map((item, index) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-img">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} />
                ) : (
                  <div className="no-image-placeholder">No Image</div>
                )}
              </div>
              <div className="cart-item-details">
                <div className="cart-item-title">{item.name}</div>
                <div className="cart-item-price">₹{item.price}</div>
              </div>
              <div className="quantity-controls">
                <button 
                  className="qty-btn"
                  onClick={() => updateQuantity(index, -1)}
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  className="qty-btn"
                  onClick={() => updateQuantity(index, 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="summary-row">
            <span>Delivery:</span>
            <span>₹{delivery}</span>
          </div>
          <div className="summary-row total-row">
            <span>Total:</span>
            <span className="total-price">₹{total}</span>
          </div>
          <button 
            className="checkout-btn" 
            onClick={() => setShowCheckoutModal(true)}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {showCheckoutModal && (
        <CheckoutModal
          cart={cart}
          onClose={() => setShowCheckoutModal(false)}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  )
}

export default Cart
