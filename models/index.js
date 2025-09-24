const { sequelize } = require("../config/db");
const { DataTypes } = require('sequelize');

const defineUser = require('./User');
const defineCategory = require('./Category');
const defineTransaction = require('./Transaction');
const defineBudget = require('./Budget');
const defineNotification = require('./Notification');
const defineSavingGoal = require('./SavingGoal');

// Initialize model classes
const User = defineUser(sequelize, DataTypes);
const Category = defineCategory(sequelize, DataTypes);
const Transaction = defineTransaction(sequelize, DataTypes);
const Budget = defineBudget(sequelize, DataTypes);
const Notification = defineNotification(sequelize, DataTypes);
const SavingGoal = defineSavingGoal(sequelize, DataTypes);

// User Associations
User.hasMany(Transaction, { foreignKey: { name: "userId", allowNull: false } });
User.hasMany(SavingGoal, { foreignKey: { name: "userId", allowNull: false } });
User.hasMany(Notification, { foreignKey: { name: "userId", allowNull: false } });
User.hasMany(Category, { foreignKey: { name: "userId", allowNull: false } });
User.hasMany(Budget, { foreignKey: { name: "userId", allowNull: false } });

// Transaction Associations
Transaction.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });
Transaction.belongsTo(Category, { foreignKey: { name: "categoryId", allowNull: false } });

// Category Associations
Category.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });
Category.hasMany(Transaction, { foreignKey: { name: "categoryId", allowNull: false } });
Category.hasMany(Budget, { foreignKey: { name: "categoryId", allowNull: false } });

// Budget Associations
Budget.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });
Budget.belongsTo(Category, { foreignKey: { name: "categoryId", allowNull: false } });

// SavingGoal Associations
SavingGoal.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });

// Notification Associations
Notification.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });

module.exports = {
    sequelize,
    User,
    Transaction,
    Category,
    Budget,
    Notification,
    SavingGoal
};
