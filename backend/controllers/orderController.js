import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js'
import Stripe from "stripe";
import { emitOrder } from '../utils/orderEvents.js'

const stripeSecret = process.env.STRIPE_SECRET_KEY;
let stripe = null;
if (stripeSecret) {
  stripe = new Stripe(stripeSecret, { apiVersion: '2022-11-15' });
} else {
  console.warn('STRIPE_SECRET_KEY is not set. Stripe operations will fail until configured.');
}

const isAdminUser = async (userId) => {
  if (!userId) return false
  const adminId = process.env.ADMIN_ID
  const adminEmail = process.env.ADMIN_EMAIL
  if (adminId && String(adminId) === String(userId)) return true
  const user = await userModel.findById(userId)
  if (!user) return false
  if (user.role === 'admin') return true
  if (adminEmail && user.email === adminEmail) return true
  return false
}

const placeOrder = async (req,res) => {
  const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

  const userId = req.userId;
  if (!userId) return res.status(401).json({ success:false, message: "Not Authorized" });

  try {
    const { items, amount, address } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided" });
    }

    const newOrder = new orderModel({
      userId: userId,
      items,
      amount,
      address
    })

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    try { emitOrder('created', newOrder) } catch (e) { console.warn('emitOrder failed', e) }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100) 
      },
      quantity: item.quantity
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: Math.round(2 * 100)
      },
      quantity: 1
    });

    if (!stripe) {
      return res.status(500).json({ success:false, message: 'Payment provider not configured' });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: 'payment',
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      metadata: { orderId: newOrder._id.toString() }
    })

    res.json({ success: true, session_url: session.url })

  } catch (error) {
    console.log(error);
    res.status(500).json({ success:false, message:"Error", error: error.message })
  }
}

const verifyOrder = async (req, res) => {
  try {
    const { orderId, success } = { ...req.query, ...req.body }

    if (!orderId) return res.status(400).json({ success: false, message: 'Missing orderId' })

    const order = await orderModel.findById(orderId)
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })

    if (String(success) === 'true' || success === true) {
      order.payment = true
      order.status = order.status === 'Food Processing' ? 'Order Confirmed' : order.status
      await order.save()
      try { emitOrder('updated', order) } catch(e) { console.warn('emitOrder failed', e) }
      return res.json({ success: true, message: 'Payment confirmed', order })
    }

    order.status = 'Payment Failed'
    await order.save()
    return res.json({ success: false, message: 'Payment not completed', order })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: 'Error verifying order', error: error.message })
  }
}

const userOrders = async (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ success:false, message: "Not Authorized" });

  try {
    const orders = await orderModel.find({ userId: userId }).sort({ date: -1 })
    res.json({ success: true, data: orders })
  } catch (error) {
    console.log(error);
    res.json({ success:false, message:"error" })
  }
}

const listOrders = async (req, res) => {
  try {
    const userId = req.userId
    const isAdmin = await isAdminUser(userId)
    if (!isAdmin) return res.status(403).json({ success: false, message: 'Not authorized' })

    const filter = {}
    if (req.query.status) filter.status = req.query.status

    const page = Math.max(1, parseInt(req.query.page || '1'))
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '20')))
    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      orderModel.find(filter).sort({ date: -1 }).skip(skip).limit(limit).populate('userId', 'name email'),
      orderModel.countDocuments(filter)
    ])

    res.json({ success: true, data: orders, meta: { total, page, limit } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Error listing orders' })
  }

  
}

const getOrder = async (req, res) => {
  try {
    const orderId = req.params.id
    if (!orderId) return res.status(400).json({ success: false, message: 'Missing order id' })

    const order = await orderModel.findById(orderId)
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })

    const userId = req.userId
    const isAdmin = await isAdminUser(userId)

    if (!isAdmin && String(order.userId) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    res.json({ success: true, data: order })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Error fetching order' })
  }
}

const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id
    if (!orderId) return res.status(400).json({ success: false, message: 'Missing order id' })

    const userId = req.userId
    const isAdmin = await isAdminUser(userId)
    if (!isAdmin) return res.status(403).json({ success: false, message: 'Not authorized' })

    const { status, payment } = req.body
    const order = await orderModel.findById(orderId)
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })

    if (typeof status === 'string') order.status = status
    if (typeof payment === 'boolean') order.payment = payment

    await order.save()
    try { emitOrder('updated', order) } catch (e) { console.warn('emitOrder failed', e) }
    res.json({ success: true, message: 'Order updated', data: order })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Error updating order' })
  }
}

export { placeOrder, verifyOrder, userOrders, listOrders, getOrder, updateOrder }
