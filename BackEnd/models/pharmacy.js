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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photoUrl: {
    type: DataTypes.STRING,
  },
  dosageForm: {
    type: ENUM(
      'tablet', 'capsule', 'syrup', 'injectable',
      'powder', 'pastille', 'cream', 'drop',
      'inhaler', 'suppository', 'spray'
    ),
    allowNull: false,
  },
  administrationMethod: {
    type: ENUM(
      'oral', 'rectal', 'vaginal', 'intravenous',
      'cutaneous', 'ocular', 'auricular'
    ),
    allowNull: false,
  },
  genericName: {
    type: DataTypes.STRING,
    allowNull: false,
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
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING,
  }
});

// DrugDosage
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
  },
  drugId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Drug,
      key: 'id'
    }
  }
});

/*
// Invoice
const Invoice = database.define('invoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'personnes', // Référence explicite à la table 'personnes'
      key: 'id'
    }
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: ENUM('pending', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  paymentMethod: {
    type: ENUM('cash', 'card', 'insurance'),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'invoices',
  timestamps: true,
  freezeTableName: true // Empêche Sequelize de pluraliser le nom de la table
});

// InvoiceItem
const InvoiceItem = database.define('invoiceItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  drugId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Drug,
      key: 'id'
    }
  },
  invoiceId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Invoice,
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
}, {
  tableName: 'invoice_items',  // Force le nom de la table en minuscules
  timestamps: true  // Pour createdAt et updatedAt
});
*/

// Establish relationships
Drug.hasMany(DrugDosage);
DrugDosage.belongsTo(Drug);

/*
Invoice.belongsTo(personne, {
  foreignKey: 'patientId',
  as: 'patient',
  targetKey: 'id',
  constraints: true
});

personne.hasMany(Invoice, {
  foreignKey: 'patientId',
  sourceKey: 'id',
  as: 'invoices',
  constraints: true
});


InvoiceItem.belongsTo(Drug, { foreignKey: 'drugId' });
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoiceId' });
Invoice.hasMany(InvoiceItem, { foreignKey: 'invoiceId', as: 'items' });
*/

module.exports = {
  Drug,
  DrugDosage
};