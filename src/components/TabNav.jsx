import './TabNav.css'

function TabNav({ activeTab, setActiveTab }) {
  return (
    <nav className="tab-nav">
      <div className="tab-container">
        <button 
          className={`tab-btn ${activeTab === 'shop' ? 'active' : ''}`}
          onClick={() => setActiveTab('shop')}
        >
          🛍️ Shop
        </button>
        <button 
          className={`tab-btn ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveTab('cart')}
        >
          🛒 My Cart
        </button>
      </div>
    </nav>
  )
}

export default TabNav
