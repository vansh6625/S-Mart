import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

function KeepAlive() {
  useEffect(() => {
    // Ping Supabase on component mount
    const ping = async () => {
      try {
        await supabase.from('products').select('id').limit(1)
      } catch (error) {
        console.error('Keepalive ping failed:', error)
      }
    }
    ping()
  }, [])

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#666'
    }}>
      <div>
        <p>✓ Service Active</p>
        <p style={{ fontSize: '12px', marginTop: '10px' }}>
          Timestamp: {new Date().toISOString()}
        </p>
      </div>
    </div>
  )
}

export default KeepAlive
