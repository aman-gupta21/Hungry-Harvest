import 'dotenv/config';
import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

const app = express()
const port = 4000

// Stripe webhook: needs raw body to verify signature
import { stripeWebhook } from './controllers/webhookController.js'
app.post('/api/order/webhook', express.raw({ type: 'application/json' }), stripeWebhook)

// middleware
app.use(express.json())
app.use(cors())

// serve uploaded images
app.use('/uploads', express.static('uploads'))

// db connection
connectDB()

// api endpoints
app.use("/api/food", foodRouter)
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order",orderRouter)

app.get("/", (req, res) => {
  res.send("API working")
})

// Global error handler - logs stack and returns JSON
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err)
  if (res.headersSent) return next(err)
  res.status(err && err.status ? err.status : 500).json({ success: false, message: err && err.message ? err.message : 'Internal Server Error' })
})

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})