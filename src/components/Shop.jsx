import { useState, useEffect } from 'react'
import { productService } from '../services/productService'
import './Shop.css'

const categories = [
  { icon: '📱', name: 'Electronics' },
  { icon: '👕', name: 'Fashion' },
  { icon: '🏠', name: 'Home & Living' },
  { icon: '📚', name: 'Books' },
  { icon: '⚽', name: 'Sports' },
  { icon: '🎮', name: 'Gaming' }
]

function Shop({ addToCart }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="shop-content">
        <div className="loading">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="shop-content">
      <h2 className="section-title">Shop by Category</h2>
      <div className="categories">
        {categories.map((cat, index) => (
          <div key={index} className="category-card">
            <div className="category-icon">{cat.icon}</div>
            <div>{cat.name}</div>
          </div>
        ))}
      </div>

      <h2 className="section-title">Featured Products</h2>
      {products.length === 0 ? (
        <div className="empty-products">
          <p>No products available. Admin can add products from admin panel.</p>
        </div>
      ) : (
        <div className="products">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-img">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} />
                ) : (
                  <div className="no-image-placeholder">No Image</div>
                )}
              </div>
              <div className="product-info">
                <div className="product-title">{product.name}</div>
                <div className="product-price">₹{product.price}</div>
                <button 
                  className="add-to-cart"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Shop
