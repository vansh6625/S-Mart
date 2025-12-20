import { useState } from 'react'
import './CheckoutModal.css'

function CheckoutModal({ cart, onClose, onCheckout }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onCheckout(formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const delivery = 40
  const total = subtotal + delivery

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Complete Your Order</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cart.map((item, index) => (
              <div key={index} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Delivery:</span>
              <span>₹{delivery}</span>
            </div>
            <div className="summary-row total">
              <strong>Total:</strong>
              <strong>₹{total}</strong>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              pattern="[0-9]{10}"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Delivery Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your complete delivery address"
              rows="3"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Continue to WhatsApp
          </button>
        </form>
      </div>
    </div>
  )
}

export default CheckoutModal
