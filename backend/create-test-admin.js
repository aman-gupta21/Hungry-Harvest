#!/usr/bin/env node

/**
 * Quick script to create a test admin user with predefined credentials
 * Usage: node create-test-admin.js
 */

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })

// User Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] }
})

const User = mongoose.model('user', userSchema)

async function createTestAdmin() {
  try {
    console.log('\n📌 Connecting to MongoDB...')
    const mongoUri = process.env.MongoUri || process.env.MONGO_URI || 'mongodb://localhost:27017/food_delivery'
    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB\n')

    // Test admin credentials
    const testAdmin = {
      name: 'Admin Manager',
      email: 'admin@admin.com',
      password: 'Admin@123'
    }

    // Check if already exists
    const existing = await User.findOne({ email: testAdmin.email })
    if (existing) {
      console.log('⚠️  Admin user already exists!')
      console.log(`\n📧 Email: ${testAdmin.email}`)
      console.log(`🔐 Password: ${testAdmin.password}`)
      process.exit(0)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(testAdmin.password, 10)

    // Create admin
    const admin = new User({
      name: testAdmin.name,
      email: testAdmin.email,
      password: hashedPassword,
      role: 'admin'
    })

    await admin.save()

    console.log('✅ Admin user created successfully!\n')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 EMAIL:    ' + testAdmin.email)
    console.log('🔐 PASSWORD: ' + testAdmin.password)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log('🎯 How to use:')
    console.log('1. Go to http://localhost:5174 (Frontend)')
    console.log('2. Click "Login"')
    console.log('3. Enter the credentials above')
    console.log('4. Go to http://localhost:5173 (Admin Panel)')
    console.log('5. ✅ You\'re logged in!\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

createTestAdmin()
