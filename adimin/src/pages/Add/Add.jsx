import React, { useState } from 'react'
import axios from "axios"
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'

const Add = ({ url }) => {

  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad"
  })

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!image) return toast.error("Upload image")
    if (!data.name || !data.description || !data.price) return toast.error("Fill all fields")

    const formData = new FormData()
    Object.keys(data).forEach(key => {
      formData.append(key, data[key])
    })
    formData.append("image", image)

    const token = localStorage.getItem('token')
    
    try {
      setLoading(true)
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      
      const res = await axios.post(`${url}/api/food/add`, formData, config)
      if (res.data.success) {
        toast.success(res.data.message)
        setData({ name:"", description:"", price:"", category:"Salad" })
        setImage(null)
      } else {
        toast.error(res.data.message || "Failed to add food")
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "Something went wrong while adding food")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler}>
      <label>
        <img src={image ? URL.createObjectURL(image) : assets.upload_area} />
        <input hidden type="file" onChange={e => setImage(e.target.files[0])} />
      </label>

      <input name="name" value={data.name} onChange={onChangeHandler} />
      <textarea name="description" value={data.description} onChange={onChangeHandler} />
      <input type="number" name="price" value={data.price} onChange={onChangeHandler} />
      <select name="category" value={data.category} onChange={onChangeHandler}>
        <option>Salad</option>
        <option>Rolls</option>
        <option>Cake</option>
      </select>

      <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'ADD'}</button>
    </form>
  )
}

export default Add
