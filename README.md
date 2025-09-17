# 🌱 KrishiSetu - Assured Contract Farming Platform

A comprehensive digital platform connecting farmers/FPOs with buyers through secure, transparent contract farming agreements with advanced features for modern agriculture.

## 🚀 Enhanced Features

### 🔐 Authentication & User Management
- **Role-based Authentication** (Farmer/Buyer)
- **Digital Signature System** with canvas-based signing
- **User Ratings & Reviews** for trust building
- **Profile Management** with verification status

### 📋 Advanced Contract Management
- **Bidirectional Contract Creation** (Farmers & Buyers can propose)
- **Multiple Categories**: Crops, Livestock, Poultry, Dairy
- **Maharashtra-specific Crops** and livestock database
- **Equipment Support Integration** (seeds, fertilizers, equipment)
- **Quality Parameters** and grading criteria
- **Contract Negotiation** system

### 💬 Communication & Collaboration
- **Real-time Chat System** between farmers and buyers
- **File Sharing** in chat (images, documents)
- **Contract-specific Discussions**
- **Message Read Receipts**

### 🛒 Shopping & Payment System
- **Shopping Cart** for bulk contract purchases
- **Multiple Payment Methods**:
  - KrishiSetu Wallet
  - UPI (PhonePe, GPay, Paytm)
  - Net Banking
  - RTGS/NEFT/IMPS
  - Credit/Debit Cards
  - Cash on Delivery
- **Payment Gateway Integration** (simulated)
- **Transaction History** and receipts

### 📊 Advanced Milestone Tracking
- **8-Stage Milestone System**:
  1. Land Preparation
  2. Sowing/Planting
  3. Germination
  4. Vegetative Growth
  5. Flowering/Breeding
  6. Fruit Development/Maturation
  7. Harvesting
  8. Post-Harvest Processing
- **Image Upload** for milestone proof
- **Progress Timeline** visualization
- **Automated Notifications**

### 🌾 Comprehensive Product Categories
- **Crops**: 50+ Maharashtra crops across categories
  - Cereals: Rice, Wheat, Jowar, Bajra, Maize
  - Pulses: Tur, Moong, Urad, Chana
  - Oilseeds: Soybean, Sunflower, Groundnut
  - Cash Crops: Sugarcane, Cotton, Turmeric
  - Vegetables: Onion, Potato, Tomato, etc.
  - Fruits: Mango, Banana, Grapes, Pomegranate
  - Spices: Chilli, Coriander, Turmeric

- **Livestock**: 
  - Cattle: Gir Cow, Sahiwal, Khillari Bull
  - Poultry: Broiler, Layer, Desi Chicken
  - Goat/Sheep: Osmanabadi, Sangamneri
  - Aquaculture: Fish, Prawns

- **Dairy Products**: Milk, Paneer, Ghee, Curd

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT + bcrypt with digital signatures
- **File Handling**: Multer for uploads
- **PDF Generation**: jsPDF for contracts
- **Real-time Features**: REST API with polling
- **Payment Integration**: Multiple gateway simulation

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Setupvb

1. **Clone the repository**
```bash
git clone <repository-url>
cd KrishiSetu
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Update MongoDB connection string in .env
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

## 🔑 Test Accounts

| Role | Email | Password | Features Available |
|------|-------|----------|-------------------|
| Farmer | farmer@test.com | farmer123 | Create contracts, Chat, Milestones, Ratings |
| Buyer | buyer@test.com | buyer123 | Browse contracts, Cart, Payments, Chat |

## 🎯 Hackathon-Ready Features

### ✅ Core Functionality
- [x] Complete CRUD operations for contracts
- [x] Role-based access control
- [x] Digital signature system
- [x] Real-time chat communication
- [x] File upload capabilities
- [x] PDF contract generation
- [x] Mobile responsive design

### ✅ Advanced Features
- [x] Shopping cart system
- [x] Multiple payment methods
- [x] Rating and review system
- [x] Equipment support integration
- [x] Advanced milestone tracking
- [x] Contract negotiation system
- [x] Maharashtra-specific crop database

### ✅ User Experience
- [x] Intuitive dashboard design
- [x] Search and filter capabilities
- [x] Progress tracking visualization
- [x] Notification system
- [x] Error handling and validation
- [x] Loading states and feedback

## 🌐 URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
KrishiSetu/
├── frontend/          # Next.js React app
├── backend/           # Express.js API
├── README.md
└── package.json
```

## 🚀 Usage Workflow

### For Farmers 👨‍🌾
1. **Register** with farmer role
2. **Create Contracts** with detailed specifications
3. **Add Equipment Support** requirements if needed
4. **Negotiate** with interested buyers via chat
5. **Digital Sign** contracts using canvas signature
6. **Track Milestones** with 8-stage progress system
7. **Upload Images** as proof of progress
8. **Complete Contracts** and receive payments
9. **Rate Buyers** after successful completion

### For Buyers 🏢
1. **Register** with buyer role
2. **Browse Contracts** by category and location
3. **Add to Cart** multiple contracts
4. **Chat with Farmers** for negotiations
5. **Propose Counter-offers** with different terms
6. **Digital Sign** agreed contracts
7. **Make Payments** using preferred method
8. **Monitor Progress** through milestone updates
9. **Rate Farmers** based on experience

### Contract Lifecycle 📋
```
Creation → Negotiation → Digital Signing → Milestone Tracking → Completion → Rating
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request