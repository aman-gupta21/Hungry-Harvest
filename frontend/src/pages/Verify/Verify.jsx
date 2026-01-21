import React, { useEffect, useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Verify.css'
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

    const verifyPayment = async () => {
      try {
        setStatus('verifying')

        const res = await axios.get(`${url}/api/order/verify`, {
          params: { orderId, success }
        })

        if (res.data?.success) {
          setStatus('success')
          setMessage(res.data.message || 'Payment verified')
          setTimeout(() => navigate('/myorders'), 1500)
        } else {
          setStatus('failed')
          setMessage(res.data?.message || 'Payment not completed')
          setTimeout(() => navigate('/myorders'), 1500)
        }
      } catch (err) {
        console.error(err)
        setStatus('error')
        setMessage('Error verifying payment')
        setTimeout(() => navigate('/myorders'), 1500)
      }
    }

    verifyPayment()
  }, [location.search, navigate, url])

  return (
    <div className="verify-page">
      {status === 'verifying' && <div className="notice">Verifying payment...</div>}
      {status === 'success' && <div className="notice success">{message}</div>}
      {status === 'failed' && <div className="notice failed">{message}</div>}
      {status === 'error' && <div className="notice error">{message}</div>}
    </div>
  )
}

export default Verify
