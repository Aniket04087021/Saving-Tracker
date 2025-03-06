const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Transaction Schema
const TransactionSchema = new mongoose.Schema({
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  method: { 
    type: String, 
    required: true,
    enum: ['Mutual Fund', 'Stock', 'Saving Account', 'Cash']
  },
  description: { 
    type: String, 
    default: '' 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

// Get total balance
app.get("/balance", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const total = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    res.json({ balance: total });
  } catch (error) {
    console.error('Balance fetch error:', error);
    res.status(500).json({ error: 'Unable to fetch balance' });
  }
});

// Get recent transactions
app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ date: -1 }) // Sort by date in descending order
      .limit(5); // Limit to 5 most recent transactions
    res.json({ transactions });
  } catch (error) {
    console.error('Transactions fetch error:', error);
    res.status(500).json({ error: 'Unable to fetch transactions' });
  }
});

// Add new savings transaction
app.post("/add-savings", async (req, res) => {
  try {
    const { amount, method, description } = req.body;
    
    // Validate input
    if (!amount || !method) {
      return res.status(400).json({ error: 'Amount and method are required' });
    }

    // Create new transaction
    const newTransaction = new Transaction({ 
      amount, 
      method, 
      description
    });
    
    // Save transaction
    await newTransaction.save();
    
    // Calculate total balance
    const transactions = await Transaction.find();
    const total = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    
    // Fetch recent transactions
    const recentTransactions = await Transaction.find()
      .sort({ date: -1 })
      .limit(5);
    
    res.json({ 
      balance: total,
      transactions: recentTransactions
    });
  } catch (error) {
    console.error('Add savings error:', error);
    res.status(500).json({ error: 'Unable to add savings' });
  }
});

// Catch-all error handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));