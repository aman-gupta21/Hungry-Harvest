import React, { useEffect, useState } from 'react'
import './Order.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const Orders = ({ url }) => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '')
  const [tokenStatus, setTokenStatus] = useState('unknown') // 'unknown' | 'valid-admin' | 'not-admin' | 'invalid' | 'no-token'
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 })
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    // when token or pagination/filter changes, validate token then fetch if admin
    let mounted = true
    const checkAndFetch = async () => {
      if (!token) {
        setTokenStatus('no-token')
        return
      }
      const ok = await validateAdminToken()
      if (ok && mounted) fetchOrders()
    }
    checkAndFetch()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page, statusFilter])

  // subscribe to server-sent events to auto-refresh list
  useEffect(() => {
    if (!token) return
    const es = new EventSource(`${url}/api/order/stream`)
    es.addEventListener('order', (e) => {
      try {
        const payload = JSON.parse(e.data)
        console.info('Order SSE', payload)
        fetchOrders()
      } catch (err) {
        console.warn('SSE parse error', err)
        fetchOrders()
      }
    })
    es.addEventListener('connected', () => console.info('SSE connected'))
    es.onerror = (err) => {
      console.warn('SSE error', err)
      // EventSource will retry automatically; do nothing
    }

    return () => es.close()
  }, [token, url])

  const authHeaders = () => ({
    headers: { Authorization: token ? `Bearer ${token}` : '' }
  })

  const validateAdminToken = async () => {
    if (!token) {
      setTokenStatus('no-token')
      return false
    }

    try {
      const res = await axios.get(`${url}/api/user/test`, authHeaders())
      if (res.data && res.data.success) {
        const user = res.data.user
        if (user && user.role === 'admin') {
          setTokenStatus('valid-admin')
          return true
        }
        setTokenStatus('not-admin')
        toast.error('Token is valid but not an admin')
        return false
      }
      setTokenStatus('invalid')
      toast.error(res.data?.message || 'Invalid token')
      return false
    } catch (err) {
      setTokenStatus('invalid')
      const msg = err.response?.data?.message || err.message || 'Token validation failed'
      toast.error(msg)
      return false
    }
  }

  const fetchOrders = async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await axios.get(`${url}/api/order/list?page=${page}&limit=${limit}${statusFilter ? `&status=${encodeURIComponent(statusFilter)}` : ''}`, authHeaders())
      if (res.data && res.data.success) {
        setOrders(res.data.data)
        setMeta(res.data.meta || { total: 0, page, limit })
      } else {
        toast.error(res.data?.message || 'Failed to fetch orders')
      }
    } catch (err) {
      console.error(err)
      const status = err.response?.status
      const msg = err.response?.data?.message || err.message || 'Error fetching orders'
      if (status === 403) {
        setTokenStatus('not-admin')
        toast.error('Not authorized: token is not an admin')
      } else if (status === 401) {
        setTokenStatus('invalid')
        toast.error('Unauthorized: token invalid or expired')
      } else {
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const onSaveToken = async () => {
    localStorage.setItem('adminToken', token)
    toast.info('Validating token...')
    const ok = await validateAdminToken()
    if (ok) {
      toast.success('Token saved and validated as admin')
      fetchOrders()
    } else {
      toast.error('Token not valid as admin; list will not be shown')
    }
  }

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const updateOrder = async (id, changes) => {
    try {
      const res = await axios.patch(`${url}/api/order/${id}`, changes, authHeaders())
      if (res.data && res.data.success) {
        toast.success(res.data.message || 'Order updated')
        // refresh the list
        fetchOrders()
      } else {
        toast.error(res.data?.message || 'Failed to update')
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || err.message || 'Error updating order')
    }
  }

  const promoteSelfToAdmin = async () => {
    if (!token) {
      toast.error('Provide token first')
      return
    }
    const secret = window.prompt('Enter admin promotion secret:')
    if (!secret) return

    try {
      const res = await axios.post(`${url}/api/user/promote`, { secret }, authHeaders())
      if (res.data && res.data.success) {
        toast.success('Promoted to admin')
        setTokenStatus('valid-admin')
        fetchOrders()
      } else {
        toast.error(res.data?.message || 'Failed to promote')
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || err.message || 'Error promoting user')
    }
  }

  const markPaid = (id) => updateOrder(id, { payment: true })
  const markUnpaid = (id) => updateOrder(id, { payment: false })
  const setStatus = (id, status) => updateOrder(id, { status })

  return (
    <div className="orders-page add flex-col">
      <p>Orders</p>

      <div className="orders-controls">
            <div className="token-input">
          <input placeholder="Paste admin JWT token" value={token} onChange={(e) => { setToken(e.target.value); setTokenStatus('unknown') }} />
          <button onClick={onSaveToken}>Save Token</button>
          <div className="token-status">
            {tokenStatus === 'valid-admin' && <span style={{ color: 'green' }}>Valid admin token</span>}
            {tokenStatus === 'not-admin' && <span style={{ color: 'orange' }}>Valid token, not admin <button onClick={promoteSelfToAdmin} style={{ marginLeft: 8 }}>Promote to admin</button></span>}
            {tokenStatus === 'invalid' && <span style={{ color: 'red' }}>Invalid token</span>}
            {tokenStatus === 'no-token' && <span style={{ color: 'gray' }}>No token</span>}
            {tokenStatus === 'unknown' && <span style={{ color: 'gray' }}>Not validated</span>}
          </div>
        </div>

        <div className="filters">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}>
            <option value="">All statuses</option>
            <option value="Food Processing">Food Processing</option>
            <option value="Order Confirmed">Order Confirmed</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Payment Failed">Payment Failed</option>
          </select>
          <button onClick={() => { setStatusFilter(''); setPage(1); fetchOrders() }}>Reset</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="orders-table">
          <div className="orders-header">
            <b>Order ID</b>
            <b>User</b>
            <b>Amount</b>
            <b>Payment</b>
            <b>Status</b>
            <b>Items</b>
            <b>Action</b>
          </div>

          {orders.map((o) => (
            <div key={o._id} className="orders-row">
              <div className="col id">{String(o._id).slice(-8)}</div>
              <div className="col user">{o.userId ? (typeof o.userId === 'string' ? String(o.userId).slice(-8) : (o.userId.name || o.userId.email || String(o.userId._id).slice(-8))) : '—'}</div>
              <div className="col amount">₹{o.amount}</div>
              <div className="col payment">{o.payment ? 'Yes' : 'No'}</div>
              <div className="col status">{o.status}</div>
              <div className="col items">{o.items ? `${o.items.length} item(s)` : '—'}</div>
              <div className="col action">
                <button onClick={() => toggleExpand(o._id)}>{expanded[o._id] ? 'Hide' : 'View'}</button>
                {o.payment ? <button onClick={() => markUnpaid(o._id)}>Mark Unpaid</button> : <button onClick={() => markPaid(o._id)}>Mark Paid</button>}
                <select onChange={(e) => setStatus(o._id, e.target.value)} defaultValue="">
                  <option value="">Set status</option>
                  <option value="Food Processing">Food Processing</option>
                  <option value="Order Confirmed">Order Confirmed</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              {expanded[o._id] && (
                <div className="orders-details">
                  <div><strong>Date:</strong> {o.date ? new Date(o.date).toLocaleString() : '—'}</div>
                  <div><strong>Customer:</strong> {o.userId ? (typeof o.userId === 'string' ? String(o.userId).slice(-8) : (o.userId.name || o.userId.email || String(o.userId._id).slice(-8))) : '—'}{o.userId && typeof o.userId !== 'string' && o.userId.email ? ` (${o.userId.email})` : ''}</div>
                  <div><strong>Address:</strong> {o.address ? `${o.address.firstName || ''} ${o.address.lastName || ''}, ${o.address.street || o.address.streer || ''}, ${o.address.city || ''}` : '—'}</div>
                  <div className="items-list">
                    <strong>Items:</strong>
                    <ul>
                      {o.items && o.items.length > 0 ? o.items.map((it, idx) => (
                        <li key={idx}>{it.name} x{it.quantity} — ₹{it.price}</li>
                      )) : <li>No items</li>}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="pagination">
            <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
            <span>Page {meta.page}</span>
            <button disabled={page * meta.limit >= meta.total} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
