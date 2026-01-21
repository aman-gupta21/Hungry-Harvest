import userModel from "../models/userModel.js"

const toKey = (id) => String(id)

const addToCart = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId
    const { itemId } = req.body

    if (!userId) return res.status(401).json({ success: false, message: "Not Authorized" })
    if (!itemId) return res.status(400).json({ success: false, message: "Missing itemId" })

    const user = await userModel.findById(userId)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })

    const cartData = (user.cartData && typeof user.cartData === "object") ? user.cartData : {}

    const key = toKey(itemId)
    cartData[key] = (Number(cartData[key]) || 0) + 1

    user.cartData = cartData
    if (typeof user.markModified === "function") user.markModified("cartData")
    await user.save()

    res.json({ success: true, message: "Added to cart", cartData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Error adding to cart" })
  }
}

const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId
    const { itemId } = req.body

    if (!userId) return res.status(401).json({ success: false, message: "Not Authorized" })
    if (!itemId) return res.status(400).json({ success: false, message: "Missing itemId" })

    const user = await userModel.findById(userId)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })

    const cartData = (user.cartData && typeof user.cartData === "object") ? user.cartData : {}
    const key = toKey(itemId)

    if (!(key in cartData)) {
      return res.status(400).json({ success: false, message: "Item not in cart" })
    }

    if (Number(cartData[key]) > 1) {
      cartData[key] = Number(cartData[key]) - 1
    } else {
      delete cartData[key]
    }

    user.cartData = cartData
    if (typeof user.markModified === "function") user.markModified("cartData")
    await user.save()

    res.json({ success: true, message: "Removed from cart", cartData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Error removing from cart" })
  }
}

const getCart = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId
    if (!userId) return res.status(401).json({ success: false, message: "Not Authorized" })

    const userData = await userModel.findById(userId)
    if (!userData) return res.status(404).json({ success: false, message: "User not found" })

    const cartData = (userData.cartData && typeof userData.cartData === "object") ? userData.cartData : {}
    res.json({ success: true, cartData })

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching cart" })
  }
}

const clearCart = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId
    if (!userId) return res.status(401).json({ success: false, message: "Not Authorized" })

    const user = await userModel.findById(userId)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })

    user.cartData = {}
    if (typeof user.markModified === "function") user.markModified("cartData")
    await user.save()

    res.json({ success: true, message: "Cart cleared", cartData: {} })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Error clearing cart" })
  }
}

export { addToCart, removeFromCart, getCart, clearCart }
