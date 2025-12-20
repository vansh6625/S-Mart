import { supabase } from '../lib/supabase'

export const productService = {
  async getAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async addProduct(product) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateProduct(id, updates) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteProduct(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async uploadImage(file) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `product-images/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath)

    return data.publicUrl
  }
}
