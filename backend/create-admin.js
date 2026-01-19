#!/usr/bin/env node

/**
 * Quick setup script to create an admin user
 * Usage: node create-admin.js
 */

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import readline from 'readline'

dotenv.config({ path: './.env' })

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

// User Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] }
})

const User = mongoose.model('user', userSchema)

async function createAdmin() {
  try {
    // Connect to MongoDB
    console.log('\n📌 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food_delivery')
    console.log('✅ Connected to MongoDB\n')

    // Get admin details
    const name = await question('Admin Name: ')
    const email = await question('Admin Email: ')
    const password = await question('Admin Password: ')
    const confirmPassword = await question('Confirm Password: ')

    // Validate
    if (password !== confirmPassword) {
      console.error('\n❌ Passwords do not match!')
      process.exit(1)
    }

    if (!name || !email || !password) {
      console.error('\n❌ All fields are required!')
      process.exit(1)
    }

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.error('\n❌ User with this email already exists!')
      process.exit(1)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin
    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    })

    await admin.save()

    console.log('\n✅ Admin created successfully!')
    console.log(`
📊 Admin Details:
  Name: ${name}
  Email: ${email}
  Role: admin
  
🔐 You can now login with these credentials:
  - Go to http://localhost:5174 (Frontend)
  - Click Login
  - Enter email and password
  - Token will be stored automatically
  - Visit admin panel at http://localhost:5173 (or your admin port)
    `)

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

createAdmin()
