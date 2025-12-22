import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Verify.css'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'

const Verify = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { url } = useContext(StoreContext)
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const orderId = params.get('orderId')
    const success = params.get('success')

    if (!orderId) {
      setStatus('error')
      setMessage('Missing orderId in query')
      return
    }

    const verify = async () => {
      try {
        setStatus('verifying')
        const res = await axios.get(`${url}/api/order/verify?orderId=${orderId}&success=${success}`)
        if (res.data && res.data.success) {
          setStatus('success')
          setMessage(res.data.message || 'Payment verified')
          setTimeout(() => navigate('/myorders'), 1500)
        } else {
          setStatus('failed')
          setMessage(res.data?.message || 'Payment not completed')
          setTimeout(() => navigate('/myorders'), 1500)
        }
      } catch (err) {
        setStatus('error')
        setMessage(err.response?.data?.message || err.message || 'Error verifying')
        setTimeout(() => navigate('/myorders'), 1500)
      }
    }

    verify()
  }, [location.search, navigate, url])

  return (
    <div className="verify-page">
      {status === 'verifying' && <div className="notice">Verifying payment...</div>}
      {status === 'success' && <div className="notice success">{message}. Redirecting to your orders...</div>}
      {status === 'failed' && <div className="notice failed">{message}. Redirecting to your orders...</div>}
      {status === 'error' && <div className="notice error">{message}</div>}
    </div>
  )
}

export default Verify