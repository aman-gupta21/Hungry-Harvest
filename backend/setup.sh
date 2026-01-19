#!/bin/bash

# Food Delivery App - Backend Setup Script
# This script sets up the backend for local development or deployment

set -e

echo "=================================================="
echo "🍔 Food Delivery App - Backend Setup"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found${NC}"
    echo "Please run this script from the backend directory"
    exit 1
fi

# Step 1: Install dependencies
echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 2: Check for .env file
echo -e "${YELLOW}Step 2: Checking environment configuration...${NC}"
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo -e "${YELLOW}Creating .env from .env.example...${NC}"
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Please edit .env with your credentials:${NC}"
        echo "   - MongoUri"
        echo "   - JWT_SECRET"
        echo "   - STRIPE_SECRET_KEY"
        echo "   - CLOUDINARY_NAME"
        echo "   - CLOUDINARY_API_KEY"
        echo "   - CLOUDINARY_API_SECRET"
        echo ""
    else
        echo -e "${RED}Error: .env.example not found${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ .env file exists${NC}"
    # Check if .env has placeholders
    if grep -q "your_" .env; then
        echo -e "${YELLOW}⚠️  Warning: .env still has placeholder values${NC}"
        echo "Please update .env with actual credentials before deployment"
    fi
fi
echo ""

# Step 3: Create uploads directory
echo -e "${YELLOW}Step 3: Setting up directories...${NC}"
mkdir -p uploads
echo -e "${GREEN}✓ uploads directory created${NC}"
echo ""

# Step 4: Check Node.js version
echo -e "${YELLOW}Step 4: Checking Node.js version...${NC}"
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js version: $NODE_VERSION${NC}"
echo ""

# Step 5: Check npm version
echo -e "${YELLOW}Step 5: Checking npm version...${NC}"
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm version: $NPM_VERSION${NC}"
echo ""

# Step 6: Verify dependencies
echo -e "${YELLOW}Step 6: Verifying critical dependencies...${NC}"
DEPS=("express" "mongoose" "jsonwebtoken" "bcrypt" "cloudinary" "stripe" "multer")
MISSING=false

for dep in "${DEPS[@]}"; do
    if npm list "$dep" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ $dep${NC}"
    else
        echo -e "${RED}✗ $dep (MISSING)${NC}"
        MISSING=true
    fi
done

if [ "$MISSING" = true ]; then
    echo -e "${RED}Some dependencies are missing. Run: npm install${NC}"
    exit 1
fi
echo ""

# Step 7: Display next steps
echo "=================================================="
echo -e "${GREEN}✓ Backend setup complete!${NC}"
echo "=================================================="
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo "1. Edit .env file with your credentials:"
echo "   nano .env"
echo ""
echo "2. Start development server:"
echo "   npm run dev"
echo ""
echo "3. Test the API:"
echo "   curl http://localhost:4000/"
echo ""
echo "4. Read deployment guides:"
echo "   - QUICK_START.md (for fast deployment)"
echo "   - DEPLOYMENT_GUIDE.md (for detailed setup)"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""
