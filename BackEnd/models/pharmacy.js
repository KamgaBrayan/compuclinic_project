// BackEnd/models/pharmacy.js

const { DataTypes, ENUM } = require('sequelize');
const database = require('../database');
const { personne } = require('./personne');

// Drug
const Drug = database.define('Drug', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: ENUM('drug', 'equipment'),
    allowNull: false,
    defaultValue: 'drug', // Important for existing records
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photoUrl: {
    type: DataTypes.STRING,
  },
  // Make these fields nullable for equipment
  dosageForm: {
    type: ENUM(
      'tablet', 'capsule', 'syrup', 'injectable',
      'powder', 'pastille', 'cream', 'drop',
      'inhaler', 'suppository', 'spray'
    ),
    allowNull: true, // CHANGED
  },
  administrationMethod: {
    type: ENUM(
      'oral', 'rectal', 'vaginal', 'intravenous',
      'cutaneous', 'ocular', 'auricular'
    ),
    allowNull: true, // CHANGED
  },
  genericName: {
    type: DataTypes.STRING,
    allowNull: true, // CHANGED
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  minStockThreshold: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  composition: {
    type: DataTypes.STRING,
  },
  laboratory: {
    type: DataTypes.STRING,
  },
  unitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  storageCondition: {
    type: ENUM('roomTemperature', 'refrigerated', 'frozen'),
    allowNull: true, // CHANGED
  },
  comment: {
    type: DataTypes.STRING,
  }
});

// DrugDosage (No changes needed here)
const DrugDosage = database.define('DrugDosage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fromAge: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  toAge: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dose: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

Drug.hasMany(DrugDosage, {
  foreignKey: 'drugId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

DrugDosage.belongsTo(Drug, {
  foreignKey: 'drugId',
  allowNull: false
});

module.exports = {
  Drug,
  DrugDosage
};
