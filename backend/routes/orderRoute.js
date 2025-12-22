import express from "express"
import { placeOrder, verifyOrder, userOrders, listOrders, getOrder, updateOrder } from "../controllers/orderController.js"
import authMiddleware from "../middleware/auth.js"

const orderRouter = express.Router()

orderRouter.post("/place", authMiddleware, placeOrder)
orderRouter.post("/userorders",authMiddleware,userOrders)

// public verify endpoint (Stripe redirects here via frontend or can call backend directly)
orderRouter.get("/verify", verifyOrder)

// admin routes
orderRouter.get('/list', authMiddleware, listOrders)
orderRouter.get('/:id', authMiddleware, getOrder)
orderRouter.patch('/:id', authMiddleware, updateOrder)

// Server-Sent Events stream for order events (admin & customer UI listeners)
orderRouter.get('/stream', (req, res) => {
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  })

  // send a ping to establish connection
  res.write('event: connected\n')
  res.write(`data: {"ok":true}\n\n`)

  const onOrder = (payload) => {
    try {
      res.write(`event: order\n`)
      res.write(`data: ${JSON.stringify(payload)}\n\n`)
    } catch (e) {
      console.warn('SSE write failed', e)
    }
  }

  import('../utils/orderEvents.js').then(({ orderEmitter }) => {
    orderEmitter.on('order', onOrder)
  }).catch(err => console.error('Failed to subscribe to orderEmitter', err))

  req.on('close', () => {
    import('../utils/orderEvents.js').then(({ orderEmitter }) => {
      orderEmitter.off('order', onOrder)
    })
  })
})


export default orderRouter