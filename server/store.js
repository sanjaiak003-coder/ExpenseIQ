const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/User");
const Category = require("./models/Category");
const Transaction = require("./models/Transaction");

const isMongo = () => mongoose.connection.readyState === 1;

const DEFAULT_CATEGORIES = [
  { name: "Salary", type: "income", color: "#22c55e", icon: "💰" },
  { name: "Freelance", type: "income", color: "#06b6d4", icon: "💻" },
  { name: "Investments", type: "income", color: "#8b5cf6", icon: "📈" },
  { name: "Other Income", type: "income", color: "#14b8a6", icon: "💵" },
  { name: "Food & Dining", type: "expense", color: "#f97316", icon: "🍔" },
  { name: "Transportation", type: "expense", color: "#3b82f6", icon: "🚗" },
  { name: "Shopping", type: "expense", color: "#ec4899", icon: "🛍️" },
  { name: "Bills & Utilities", type: "expense", color: "#eab308", icon: "📄" },
  { name: "Entertainment", type: "expense", color: "#a855f7", icon: "🎬" },
  { name: "Healthcare", type: "expense", color: "#ef4444", icon: "🏥" },
  { name: "Education", type: "expense", color: "#6366f1", icon: "📚" },
  { name: "Other Expense", type: "expense", color: "#64748b", icon: "📦" }
];

const memUsers = [];
const memCategories = [];
const memTransactions = [];

let idCounter = 1;
const genId = () => (idCounter++).toString();

async function initMemoryStore() {
  if (memUsers.length > 0) return;
  const hashedPassword = await bcrypt.hash("password123", 10);
  const demoUserId = "demo_user_1";
  const demoUser = {
    _id: demoUserId,
    name: "Alex Johnson",
    email: "demo@expenseiq.com",
    password: hashedPassword,
    createdAt: new Date()
  };
  memUsers.push(demoUser);

  const catMap = {};
  DEFAULT_CATEGORIES.forEach(cat => {
    const catId = genId();
    const c = { ...cat, _id: catId, user: demoUserId, createdAt: new Date() };
    memCategories.push(c);
    catMap[cat.name] = c;
  });

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const sampleTxns = [
    { type: "income", amount: 75000, category: catMap["Salary"]._id, description: "Monthly Salary", date: new Date(year, month, 1), user: demoUserId },
    { type: "income", amount: 15000, category: catMap["Freelance"]._id, description: "UI Design Project", date: new Date(year, month, 10), user: demoUserId },
    { type: "expense", amount: 18000, category: catMap["Bills & Utilities"]._id, description: "Apartment Rent & Utilities", date: new Date(year, month, 2), user: demoUserId },
    { type: "expense", amount: 6500, category: catMap["Food & Dining"]._id, description: "Groceries & Dining Out", date: new Date(year, month, 5), user: demoUserId },
    { type: "expense", amount: 3200, category: catMap["Transportation"]._id, description: "Fuel & Metro Pass", date: new Date(year, month, 8), user: demoUserId },
    { type: "expense", amount: 4500, category: catMap["Shopping"]._id, description: "New Running Shoes", date: new Date(year, month, 12), user: demoUserId },
    { type: "expense", amount: 1200, category: catMap["Entertainment"]._id, description: "Movie & Streaming Subs", date: new Date(year, month, 15), user: demoUserId },
    { type: "income", amount: 75000, category: catMap["Salary"]._id, description: "Monthly Salary", date: new Date(year, month - 1, 1), user: demoUserId },
    { type: "expense", amount: 28000, category: catMap["Bills & Utilities"]._id, description: "Rent & Bills", date: new Date(year, month - 1, 3), user: demoUserId },
    { type: "expense", amount: 7200, category: catMap["Food & Dining"]._id, description: "Groceries", date: new Date(year, month - 1, 14), user: demoUserId },
    { type: "income", amount: 75000, category: catMap["Salary"]._id, description: "Monthly Salary", date: new Date(year, month - 2, 1), user: demoUserId },
    { type: "expense", amount: 31000, category: catMap["Bills & Utilities"]._id, description: "Rent & Utilities", date: new Date(year, month - 2, 4), user: demoUserId }
  ];

  sampleTxns.forEach(t => {
    memTransactions.push({ ...t, _id: genId(), createdAt: new Date() });
  });
}

initMemoryStore();

module.exports = {
  DEFAULT_CATEGORIES,
  isMongo,

  async findUserByEmail(email) {
    if (isMongo()) return await User.findOne({ email }).select("+password");
    return memUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (isMongo()) return await User.findById(id);
    return memUsers.find(u => u._id.toString() === id.toString()) || null;
  },

  async createUser({ name, email, password }) {
    if (isMongo()) {
      const user = await User.create({ name, email, password });
      const categories = DEFAULT_CATEGORIES.map(cat => ({ ...cat, user: user._id }));
      await Category.insertMany(categories);
      return user;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      _id: genId(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date()
    };
    memUsers.push(user);
    DEFAULT_CATEGORIES.forEach(cat => {
      memCategories.push({ ...cat, _id: genId(), user: user._id, createdAt: new Date() });
    });
    return user;
  },

  async comparePassword(candidate, hash) {
    return await bcrypt.compare(candidate, hash);
  },

  async getCategories(userId, type) {
    if (isMongo()) {
      const filter = { user: userId };
      if (type) filter.type = type;
      return await Category.find(filter).sort({ type: 1, name: 1 });
    }
    let list = memCategories.filter(c => c.user.toString() === userId.toString());
    if (type) list = list.filter(c => c.type === type);
    return list.sort((a, b) => a.name.localeCompare(b.name));
  },

  async createCategory(userId, { name, type, color, icon }) {
    if (isMongo()) {
      return await Category.create({ name, type, color: color || "#6366f1", icon: icon || "📁", user: userId });
    }
    const existing = memCategories.find(c => c.user.toString() === userId.toString() && c.name.toLowerCase() === name.toLowerCase() && c.type === type);
    if (existing) {
      const err = new Error("Category already exists");
      err.status = 400;
      throw err;
    }
    const cat = {
      _id: genId(),
      name,
      type,
      color: color || "#6366f1",
      icon: icon || "📁",
      user: userId,
      createdAt: new Date()
    };
    memCategories.push(cat);
    return cat;
  },

  async updateCategory(userId, catId, { name, color, icon }) {
    if (isMongo()) {
      return await Category.findOneAndUpdate(
        { _id: catId, user: userId },
        { name, color, icon },
        { new: true }
      );
    }
    const cat = memCategories.find(c => c._id.toString() === catId.toString() && c.user.toString() === userId.toString());
    if (!cat) return null;
    if (name) cat.name = name;
    if (color) cat.color = color;
    if (icon) cat.icon = icon;
    return cat;
  },

  async deleteCategory(userId, catId) {
    if (isMongo()) {
      const deleted = await Category.findOneAndDelete({ _id: catId, user: userId });
      if (deleted) {
        await Transaction.deleteMany({ category: catId, user: userId });
      }
      return deleted;
    }
    const idx = memCategories.findIndex(c => c._id.toString() === catId.toString() && c.user.toString() === userId.toString());
    if (idx === -1) return null;
    const deleted = memCategories.splice(idx, 1)[0];
    for (let i = memTransactions.length - 1; i >= 0; i--) {
      if (memTransactions[i].category.toString() === catId.toString() && memTransactions[i].user.toString() === userId.toString()) {
        memTransactions.splice(i, 1);
      }
    }
    return deleted;
  },

  async getTransactions(userId, { type, category, month, year, page = 1, limit = 50 }) {
    if (isMongo()) {
      const filter = { user: userId };
      if (type && ["income", "expense"].includes(type)) filter.type = type;
      if (category) filter.category = category;
      if (month && year) {
        const m = parseInt(month) - 1;
        const y = parseInt(year);
        filter.date = { $gte: new Date(y, m, 1), $lte: new Date(y, m + 1, 0, 23, 59, 59, 999) };
      } else if (year) {
        const y = parseInt(year);
        filter.date = { $gte: new Date(y, 0, 1), $lte: new Date(y, 11, 31, 23, 59, 59, 999) };
      }
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Transaction.countDocuments(filter);
      const transactions = await Transaction.find(filter)
        .populate("category", "name type color icon")
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      return { transactions, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } };
    }

    let list = memTransactions.filter(t => t.user.toString() === userId.toString());
    if (type) list = list.filter(t => t.type === type);
    if (category) list = list.filter(t => t.category.toString() === category.toString());
    if (month && year) {
      const m = parseInt(month) - 1;
      const y = parseInt(year);
      list = list.filter(t => {
        const d = new Date(t.date);
        return d.getFullYear() === y && d.getMonth() === m;
      });
    } else if (year) {
      const y = parseInt(year);
      list = list.filter(t => new Date(t.date).getFullYear() === y);
    }

    list.sort((a, b) => new Date(b.date) - new Date(a.date));
    const total = list.length;
    const p = parseInt(page);
    const l = parseInt(limit);
    const skip = (p - 1) * l;
    const paginated = list.slice(skip, skip + l).map(t => {
      const cat = memCategories.find(c => c._id.toString() === t.category.toString()) || null;
      return { ...t, category: cat };
    });

    return {
      transactions: paginated,
      pagination: { total, page: p, pages: Math.max(1, Math.ceil(total / l)) }
    };
  },

  async createTransaction(userId, { type, amount, category, description, date }) {
    if (isMongo()) {
      const txn = await Transaction.create({
        type,
        amount,
        category,
        description: description || "",
        date: date || new Date(),
        user: userId
      });
      return await txn.populate("category", "name type color icon");
    }

    const cat = memCategories.find(c => c._id.toString() === category.toString()) || null;
    const txn = {
      _id: genId(),
      type,
      amount: Number(amount),
      category: category,
      description: description || "",
      date: date ? new Date(date) : new Date(),
      user: userId,
      createdAt: new Date()
    };
    memTransactions.push(txn);
    return { ...txn, category: cat };
  },

  async updateTransaction(userId, txnId, { type, amount, category, description, date }) {
    if (isMongo()) {
      return await Transaction.findOneAndUpdate(
        { _id: txnId, user: userId },
        { type, amount, category, description, date },
        { new: true }
      ).populate("category", "name type color icon");
    }

    const txn = memTransactions.find(t => t._id.toString() === txnId.toString() && t.user.toString() === userId.toString());
    if (!txn) return null;
    if (type) txn.type = type;
    if (amount !== undefined) txn.amount = Number(amount);
    if (category) txn.category = category;
    if (description !== undefined) txn.description = description;
    if (date) txn.date = new Date(date);

    const cat = memCategories.find(c => c._id.toString() === txn.category.toString()) || null;
    return { ...txn, category: cat };
  },

  async deleteTransaction(userId, txnId) {
    if (isMongo()) {
      return await Transaction.findOneAndDelete({ _id: txnId, user: userId });
    }
    const idx = memTransactions.findIndex(t => t._id.toString() === txnId.toString() && t.user.toString() === userId.toString());
    if (idx === -1) return null;
    return memTransactions.splice(idx, 1)[0];
  },

  async getMonthlyReport(userId, year) {
    const y = year ? parseInt(year) : new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthName: new Date(y, i).toLocaleString("default", { month: "short" }),
      income: 0,
      expense: 0,
      incomeCount: 0,
      expenseCount: 0
    }));

    if (isMongo()) {
      const startDate = new Date(y, 0, 1);
      const endDate = new Date(y, 11, 31, 23, 59, 59, 999);
      const result = await Transaction.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId), date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: { month: { $month: "$date" }, type: "$type" }, total: { $sum: "$amount" }, count: { $sum: 1 } } }
      ]);
      result.forEach(item => {
        const idx = item._id.month - 1;
        if (item._id.type === "income") {
          months[idx].income = item.total;
          months[idx].incomeCount = item.count;
        } else {
          months[idx].expense = item.total;
          months[idx].expenseCount = item.count;
        }
      });
    } else {
      const txns = memTransactions.filter(t => t.user.toString() === userId.toString());
      txns.forEach(t => {
        const d = new Date(t.date);
        if (d.getFullYear() === y) {
          const idx = d.getMonth();
          if (t.type === "income") {
            months[idx].income += t.amount;
            months[idx].incomeCount += 1;
          } else {
            months[idx].expense += t.amount;
            months[idx].expenseCount += 1;
          }
        }
      });
    }

    const totalIncome = months.reduce((s, m) => s + m.income, 0);
    const totalExpense = months.reduce((s, m) => s + m.expense, 0);

    return {
      year: y,
      months,
      summary: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense
      }
    };
  },

  async getCategoryBreakdown(userId, month, year, type = "expense") {
    const now = new Date();
    const m = month ? parseInt(month) : now.getMonth() + 1;
    const y = year ? parseInt(year) : now.getFullYear();

    let breakdown = [];

    if (isMongo()) {
      const startDate = new Date(y, m - 1, 1);
      const endDate = new Date(y, m, 0, 23, 59, 59, 999);
      const result = await Transaction.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId), type, date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
        { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } },
        { $unwind: "$category" },
        { $project: { _id: 0, categoryId: "$category._id", categoryName: "$category.name", color: "$category.color", icon: "$category.icon", total: 1, count: 1 } },
        { $sort: { total: -1 } }
      ]);
      breakdown = result;
    } else {
      const map = {};
      memTransactions.forEach(t => {
        if (t.user.toString() === userId.toString() && t.type === type) {
          const d = new Date(t.date);
          if (d.getFullYear() === y && d.getMonth() === m - 1) {
            const cat = memCategories.find(c => c._id.toString() === t.category.toString());
            const catId = t.category.toString();
            if (!map[catId]) {
              map[catId] = {
                categoryId: catId,
                categoryName: cat ? cat.name : "Other",
                color: cat ? cat.color : "#6366f1",
                icon: cat ? cat.icon : "📁",
                total: 0,
                count: 0
              };
            }
            map[catId].total += t.amount;
            map[catId].count += 1;
          }
        }
      });
      breakdown = Object.values(map).sort((a, b) => b.total - a.total);
    }

    const grandTotal = breakdown.reduce((s, r) => s + r.total, 0);
    const withPercentages = breakdown.map(r => ({
      ...r,
      percentage: grandTotal > 0 ? Math.round((r.total / grandTotal) * 100) : 0
    }));

    return { month: m, year: y, type, grandTotal, breakdown: withPercentages };
  }
};