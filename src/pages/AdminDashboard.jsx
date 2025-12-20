import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import Papa from 'papaparse'
import './AdminDashboard.css'

function AdminDashboard({ showToast, setIsAdmin }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image_url: ''
  })
  const [bulkProducts, setBulkProducts] = useState([])
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts()
      setProducts(data)
    } catch (error) {
      showToast('Error loading products')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setUploading(true)
      const imageUrl = await productService.uploadImage(file)
      setFormData({ ...formData, image_url: imageUrl })
      showToast('Image uploaded successfully!')
    } catch (error) {
      showToast('Error uploading image')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const sanitizeName = (str) =>
    String(str || '').replace(/[\r\n\t]/g, ' ').trim().slice(0, 120)

  const handleCsvUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase(),
      complete: (results) => {
        try {
          const rows = Array.isArray(results.data) ? results.data : []
          const productsFromCsv = rows.slice(0, 500).map((row, index) => {
            const name = sanitizeName(row.name ?? row.Name ?? row.NAME)
            const priceVal = parseFloat(row.price ?? row.Price ?? row.PRICE)
            return {
              id: `temp-${index}`,
              tempId: `temp-${index}`,
              name,
              price: Number.isFinite(priceVal) ? priceVal : NaN,
              image_url: ''
            }
          }).filter(p => p.name && Number.isFinite(p.price))

          setBulkProducts(productsFromCsv)
          setShowBulkUpload(true)
          showToast(`Loaded ${productsFromCsv.length} products from CSV`)
        } catch (err) {
          console.error(err)
          showToast('Error reading CSV file')
        }
      },
      error: () => showToast('Error parsing CSV')
    })
  }

  const handleBulkImageUpload = async (tempId, e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const imageUrl = await productService.uploadImage(file)
      setBulkProducts(bulkProducts.map(p => 
        p.tempId === tempId ? { ...p, image_url: imageUrl } : p
      ))
      showToast('Image uploaded!')
    } catch (error) {
      showToast('Error uploading image')
      console.error(error)
    }
  }

  const handleBulkSubmit = async () => {
    try {
      setUploading(true)
      let successCount = 0
      
      for (const product of bulkProducts) {
        if (product.name && product.price) {
          await productService.addProduct({
            name: product.name,
            price: product.price,
            image_url: product.image_url || ''
          })
          successCount++
        }
      }
      
      showToast(`Successfully added ${successCount} products!`)
      setShowBulkUpload(false)
      setBulkProducts([])
      loadProducts()
    } catch (error) {
      showToast('Error adding products')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData)
        showToast('Product updated successfully!')
      } else {
        await productService.addProduct(formData)
        showToast('Product added successfully!')
      }
      setShowForm(false)
      setEditingProduct(null)
      setFormData({ name: '', price: '', image_url: '' })
      loadProducts()
    } catch (error) {
      showToast('Error saving product')
      console.error(error)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price,
      image_url: product.image_url || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      await productService.deleteProduct(id)
      showToast('Product deleted successfully!')
      loadProducts()
    } catch (error) {
      showToast('Error deleting product')
      console.error(error)
    }
  }

  const handleLogout = () => {
    setIsAdmin(false)
    navigate('/')
  }

  if (loading) {
    return <div className="admin-dashboard"><div className="loading">Loading...</div></div>
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>🛍️ Admin Dashboard</h1>
        <div className="admin-actions">
          <label className="btn-upload">
            📊 Bulk Upload (CSV)
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              style={{ display: 'none' }}
            />
          </label>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Add Product
          </button>
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {showBulkUpload && (
        <div className="modal">
          <div className="modal-content bulk-upload-modal">
            <h2>Bulk Upload Products</h2>
            <p className="bulk-info">
              Loaded {bulkProducts.length} products. Upload images for each product below.
            </p>
            <div className="bulk-products-list">
              {bulkProducts.map((product) => (
                <div key={product.tempId} className="bulk-product-item">
                  <div className="bulk-product-info">
                    <strong>{product.name}</strong>
                    <span>₹{product.price}</span>
                  </div>
                  <div className="bulk-image-upload">
                    {product.image_url ? (
                      <div className="image-uploaded">
                        <img src={product.image_url} alt={product.name} />
                        <span>✓ Uploaded</span>
                      </div>
                    ) : (
                      <label className="upload-label">
                        📷 Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleBulkImageUpload(product.tempId, e)}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="form-actions">
              <button 
                className="btn-primary" 
                onClick={handleBulkSubmit}
                disabled={uploading}
              >
                {uploading ? 'Adding Products...' : 'Add All Products'}
              </button>
              <button 
                className="btn-secondary"
                onClick={() => {
                  setShowBulkUpload(false)
                  setBulkProducts([])
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && <p>Uploading...</p>}
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="image-preview" />
                )}
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false)
                    setEditingProduct(null)
                    setFormData({ name: '', price: '', image_url: '' })
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="admin-product-card">
            <div className="product-image">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} />
              ) : (
                <div className="no-image">No Image</div>
              )}
            </div>
            <div className="product-details">
              <h3>{product.name}</h3>
              <p className="price">₹{product.price}</p>
            </div>
            <div className="product-actions">
              <button className="btn-edit" onClick={() => handleEdit(product)}>
                Edit
              </button>
              <button className="btn-delete" onClick={() => handleDelete(product.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
