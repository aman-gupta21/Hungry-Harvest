import Stripe from 'stripe'
import orderModel from '../models/orderModel.js'

const stripeSecret = process.env.STRIPE_SECRET_KEY
let stripe = null
if (stripeSecret) {
  stripe = new Stripe(stripeSecret, { apiVersion: '2022-11-15' })
} else {
  console.warn('STRIPE_SECRET_KEY is not set. Stripe webhook handling will be limited until configured.')
}

export const stripeWebhook = async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
  const sig = req.headers['stripe-signature']

  try {
    let event

    if (endpointSecret && sig && stripe) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
    } else {
      try {
        event = JSON.parse(req.body.toString())
      } catch (e) {
        console.error('Failed to parse webhook payload:', e)
        return res.status(400).send('Invalid payload')
      }
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const orderId = session.metadata && session.metadata.orderId
        if (!orderId) {
          console.warn('Webhook received without orderId metadata')
          break
        }

        const order = await orderModel.findById(orderId)
        if (!order) {
          console.warn('Order not found for webhook orderId:', orderId)
          break
        }

        order.payment = true
        order.status = order.status === 'Food Processing' ? 'Order Confirmed' : order.status
        await order.save()
        try { const { emitOrder } = await import('../utils/orderEvents.js'); emitOrder('updated', order) } catch (e) { console.warn('emitOrder failed in webhook', e) }
        console.log('Order updated by webhook:', orderId)
        break
      }
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.json({ received: true })
  } catch (err) {
    console.error('Webhook error', err)
    res.status(400).send(`Webhook Error: ${err.message}`)
  }
}
