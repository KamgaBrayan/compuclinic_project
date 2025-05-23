const { Drug, DrugDosage, Invoice, InvoiceItem, Patient } = require('../models/pharmacy'); // Import your Drug, DrugDosage, Invoice, InvoiceItem and Patient models
const { Op } = require('sequelize'); // Import Sequelize operators
const database = require('../database'); // Import database instance

/**
 * Search for drugs by a specific field.
 */
const searchDrugs = async (req, res) => {
  try {
    const { field, query } = req.query; // Search field and query

    // Define meaningful fields to search
    const searchableFields = [
      'name',
      'genericName',
      'composition',
      'laboratory',
      'comment',
    ];

    // Validate the search field
    if (!searchableFields.includes(field)) {
      return res.status(400).json({ message: 'Invalid search field' });
    }

    // Build the WHERE clause dynamically
    const whereClause = {
      [field]: { [Op.like]: `%${query}%` }, // Case-insensitive search
    };

    // Search for drugs and include dosages
    const drugs = await Drug.findAll({
      where: whereClause,
      include: DrugDosage, // Include dosage information
    });

    res.status(200).json({ drugs });
  } catch (error) {
    console.error('Error searching drugs:', error);
    res.status(500).json({ message: 'Error searching drugs', error: error.message });
  }
};

/**
 * Create a new drug.
 */
const createDrug = async (req, res) => {
  try {
    const {
      name,
      photoUrl,
      dosageForm,
      administrationMethod,
      genericName,
      stock,
      minStockThreshold,
      composition,
      laboratory,
      unitPrice,
      storageCondition,
      comment,
    } = req.body;

    // Create the drug
    const newDrug = await Drug.create({
      name,
      photoUrl,
      dosageForm,
      administrationMethod,
      genericName,
      stock,
      minStockThreshold,
      composition,
      laboratory,
      unitPrice,
      storageCondition,
      comment,
    });

    res.status(201).json({ message: 'Drug created successfully', drug: newDrug });
  } catch (error) {
    console.error('Error creating drug:', error);
    res.status(500).json({ message: 'Error creating drug', error: error.message });
  }
};

/**
 * Edit an existing drug.
 */
const editDrug = async (req, res) => {
  try {
    const { id } = req.params; // Drug ID
    const updates = req.body; // Fields to update

    // Find the drug by ID
    const drug = await Drug.findByPk(id);
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }

    // Update the drug
    await drug.update(updates);

    res.status(200).json({ message: 'Drug updated successfully', drug });
  } catch (error) {
    console.error('Error updating drug:', error);
    res.status(500).json({ message: 'Error updating drug', error: error.message });
  }
};

/**
 * Delete a drug.
 */
const deleteDrug = async (req, res) => {
  try {
    const { id } = req.params; // Drug ID

    // Find the drug by ID
    const drug = await Drug.findByPk(id);
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }

    // Delete the drug
    await drug.destroy();

    res.status(200).json({ message: 'Drug deleted successfully' });
  } catch (error) {
    console.error('Error deleting drug:', error);
    res.status(500).json({ message: 'Error deleting drug', error: error.message });
  }
};

/**
 * Get all drugs.
 */
const getAllDrugs = async (req, res) => {
  try {
    // Fetch all drugs and include dosages
    const drugs = await Drug.findAll({
      include: DrugDosage, // Include dosage information
    });

    res.status(200).json({ drugs });
  } catch (error) {
    console.error('Error fetching drugs:', error);
    res.status(500).json({ message: 'Error fetching drugs', error: error.message });
  }
};

/**
 * Get a drug by ID.
 */
const getDrugById = async (req, res) => {
  try {
    const { id } = req.params; // Drug ID

    // Find the drug by ID and include dosages
    const drug = await Drug.findByPk(id, {
      include: DrugDosage, // Include dosage information
    });

    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }

    res.status(200).json({ drug });
  } catch (error) {
    console.error('Error fetching drug:', error);
    res.status(500).json({ message: 'Error fetching drug', error: error.message });
  }
};

/**
 * Add dosage information for a drug.
 */
const addDrugDosage = async (req, res) => {
  try {
    const { drugId } = req.params; // Drug ID
    const { fromAge, toAge, dose } = req.body;

    // Check if the drug exists
    const drug = await Drug.findByPk(drugId);
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }

    // Create the dosage
    const newDosage = await DrugDosage.create({
      drugId,
      fromAge,
      toAge,
      dose,
    });

    res.status(201).json({ message: 'Dosage added successfully', dosage: newDosage });
  } catch (error) {
    console.error('Error adding dosage:', error);
    res.status(500).json({ message: 'Error adding dosage', error: error.message });
  }
};

/**
 * Get dosages for a specific drug.
 */
const getDrugDosages = async (req, res) => {
  try {
    const { drugId } = req.params;
    
    // Find all dosages for the drug
    const dosages = await DrugDosage.findAll({
      where: { drugId: drugId },
      order: [['fromAge', 'ASC']] // Order by age range
    });

    if (!dosages) {
      return res.status(404).json({ message: 'No dosages found for this drug' });
    }

    res.status(200).json(dosages);
  } catch (error) {
    console.error('Error fetching drug dosages:', error);
    res.status(500).json({ message: 'Error fetching drug dosages', error: error.message });
  }
};

/*
//  Create a new invoice with items

const createInvoice = async (req, res) => {
  try {
    const { patientId, items, totalAmount, paymentMethod } = req.body;

    // Validate required fields
    if (!patientId || !items || !totalAmount || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Start a transaction
    const result = await database.transaction(async (t) => {
      // Create invoice
      const invoice = await Invoice.create({
        patientId,
        totalAmount,
        paymentMethod,
        status: 'pending'
      }, { transaction: t });

      // Create invoice items and update drug stock
      for (const item of items) {
        const drug = await Drug.findByPk(item.drugId, { transaction: t });
        if (!drug) {
          throw new Error(`Drug with id ${item.drugId} not found`);
        }

        if (drug.stock < item.quantity) {
          throw new Error(`Insufficient stock for drug ${drug.name}`);
        }

        // Create invoice item
        await InvoiceItem.create({
          invoiceId: invoice.id,
          drugId: item.drugId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal
        }, { transaction: t });

        // Update drug stock
        await drug.update({
          stock: drug.stock - item.quantity
        }, { transaction: t });
      }

      // Return created invoice with items
      return invoice;
    });

    // Fetch complete invoice with items and patient info
    const completeInvoice = await Invoice.findByPk(result.id, {
      include: [
        {
          model: InvoiceItem,
          as: 'items',
          include: [Drug]
        },
        {
          model: Patient
        }
      ]
    });

    res.status(201).json(completeInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ message: error.message });
  }
};


 //Get all invoices with their items and patient info
 
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: [
        {
          model: InvoiceItem,
          as: 'items',
          include: [Drug]
        },
        {
          model: Patient
        }
      ],
      order: [['date', 'DESC']]
    });

    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Error fetching invoices' });
  }
};


// Get invoice by ID with items and patient info
 
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByPk(id, {
      include: [
        {
          model: InvoiceItem,
          as: 'items',
          include: [Drug]
        },
        {
          model: Patient
        }
      ]
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ message: 'Error fetching invoice' });
  }
};


 // Update invoice status
 
const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    await invoice.update({ status });
    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error updating invoice status:', error);
    res.status(500).json({ message: 'Error updating invoice status' });
  }
};


 // Search invoices by patient name or date range
 
const searchInvoices = async (req, res) => {
  try {
    const { patientName, startDate, endDate } = req.query;
    let whereClause = {};
    let patientWhereClause = {};

    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    if (patientName) {
      patientWhereClause = {
        [Op.or]: [
          { firstName: { [Op.like]: `%${patientName}%` } },
          { lastName: { [Op.like]: `%${patientName}%` } }
        ]
      };
    }

    const invoices = await Invoice.findAll({
      where: whereClause,
      include: [
        {
          model: InvoiceItem,
          as: 'items',
          include: [Drug]
        },
        {
          model: Patient,
          where: patientWhereClause,
          required: !!patientName
        }
      ],
      order: [['date', 'DESC']]
    });

    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error searching invoices:', error);
    res.status(500).json({ message: 'Error searching invoices' });
  }
};
*/

module.exports = {
  createDrug,
  editDrug,
  deleteDrug,
  getAllDrugs,
  getDrugById,
  searchDrugs,
  addDrugDosage,
  getDrugDosages,
};