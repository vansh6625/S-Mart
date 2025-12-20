import './Header.css'

function Header({ cartCount, onCartClick }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          🛍️ S-Mart
        </div>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search products or services..." 
          />
        </div>
        <div className="header-icons">
          <button className="icon-btn" onClick={onCartClick}>
            🛒 Cart (<span>{cartCount}</span>)
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
