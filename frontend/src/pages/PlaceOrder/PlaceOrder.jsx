// ...existing code...
import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const PlaceOrder = () => {

  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext)
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  useEffect(() => {
    // debug
  }, [data])

  const handleProceed = async () => {
    setError("")
    if (!token) return setError("Please log in to place an order.")

    const items = Object.entries(cartItems).flatMap(([id, qty]) => {
      if (!qty || qty <= 0) return []
      const product = food_list.find(p => p._id === id)
      if (!product) return []
      return [{ id: product._id, name: product.name, price: product.price, quantity: qty }]
    })

    if (items.length === 0) return setError("Your cart is empty")

    const delivery = getTotalCartAmount() === 0 ? 0 : 32
    const amount = getTotalCartAmount() + delivery

    try {
      setLoading(true)
      const res = await axios.post(url + '/api/order/place', { items, amount, address: data }, { headers: { token } })
      if (res.data && res.data.success) {
        if (res.data.session_url) {
          // redirect to Stripe checkout
          window.location.href = res.data.session_url
        } else {
          // payment provider not configured or payment not required - redirect to orders
          window.location.href = '/myorders'
        }
      } else {
        setError(res.data?.message || 'Failed to place order')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error placing order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className='place-order' action="" onSubmit={(e) => e.preventDefault()}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>

        <input name='email' onChange={onChangeHandler} value={data.email} type="text" placeholder='Email Address' />
        <input name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />

        <div className="multi-fields">
          <input name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>

        <div className="multi-fields">
          <input name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' />
          <input name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>

        <input name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
        {error && <div className="form-error">{error}</div>}
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{getTotalCartAmount()}</p>
          </div>

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{getTotalCartAmount()===0?0:32}</p>
          </div>

          <div className="cart-total-details">
            <b>Total</b>
            <b>₹{getTotalCartAmount()===0?0:getTotalCartAmount()+32}</b>
          </div>

          <button type="button" disabled={loading} onClick={handleProceed}>{loading ? 'Processing...' : 'PROCEED TO PAYMENT'}</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
// ...existing code...