import React, { useContext, useEffect, useState } from 'react'
import './MyOrder.css'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'

const MyOrder = () => {
  const { url, token } = useContext(StoreContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const fetchOrders = async () => {
      try {
        setLoading(true)
        const res = await axios.post(url + '/api/order/userorders', {}, { headers: { token } })
        if (res.data && res.data.success) {
          setOrders(res.data.data || [])
        } else {
          setError(res.data?.message || 'Failed to fetch orders')
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error fetching orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()

    // subscribe to order SSEs so user's orders refresh on updates
    const es = new EventSource(`${url}/api/order/stream`)
    es.addEventListener('order', (e) => {
      try {
        // simply refetch — server returns payload but refetching ensures consistent ordering
        fetchOrders()
      } catch (err) {
        console.warn('SSE parse error', err)
        fetchOrders()
      }
    })

    es.onerror = () => {
      // ignore, EventSource will auto-retry
    }

    return () => es.close()
  }, [token, url])

  if (!token) {
    return (
      <div className="my-orders">
        <div className="notice">Please log in to view your orders.</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="my-orders">
        <div className="notice">Loading your orders...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="my-orders">
        <div className="notice error">{error}</div>
      </div>
    )
  }

  return (
    <div className="my-orders">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty">You have no orders yet.</div>
      ) : (
        <div className="orders-list">
          {orders.slice().reverse().map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-head">
                <div className="order-id">Order #{String(order._id).slice(-6)}</div>
                <div className="order-date">{order.date ? new Date(order.date).toLocaleString() : '—'}</div>
              </div>

              <div className="order-meta">
                <div className="order-status">Status: <strong>{order.status}</strong></div>
                <div className="order-amount">Amount: <strong>₹{order.amount}</strong></div>
                <div className="order-payment">Paid: <strong>{order.payment ? 'Yes' : 'No'}</strong></div>
              </div>

              <div className="order-items">
                <p className="items-title">Items</p>
                <ul>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((it, idx) => (
                      <li key={idx}>
                        <span className="item-name">{it.name}</span>
                        <span className="item-qty">x{it.quantity}</span>
                        <span className="item-price">₹{it.price}</span>
                      </li>
                    ))
                  ) : (
                    <li className="empty-item">No items</li>
                  )}
                </ul>
              </div>

              {order.address && (
                <div className="order-address">
                  <p className="addr-title">Delivery Address</p>
                  <div>{order.address.firstName || ''} {order.address.lastName || ''}</div>
                  <div>{order.address.street || order.address.streer || ''}</div>
                  <div>{order.address.city || ''} {order.address.state || ''} {order.address.zipcode || ''}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrder
