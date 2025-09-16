# 🌱 KrishiSetu - Assured Contract Farming Platform

A full-stack web application connecting farmers/FPOs with buyers for contract farming agreements.

## 🚀 Features

- **Role-based Authentication** (Farmer/Buyer)
- **Contract Creation & Digital Signing**
- **Milestone Tracking** with image uploads
- **Dummy Wallet System** with payment simulation
- **PDF Contract Generation**
- **Responsive Dashboards**

## 🛠 Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **File Uploads**: Multer
- **PDF Generation**: jsPDF

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Setup

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

### Farmer Account
- Email: farmer@test.com
- Password: farmer123

### Buyer Account
- Email: buyer@test.com
- Password: buyer123

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

## 🚀 Usage

1. Register as Farmer or Buyer
2. Farmers can create contracts
3. Buyers can view and sign contracts
4. Track milestones with image uploads
5. Automatic payment release on completion

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request