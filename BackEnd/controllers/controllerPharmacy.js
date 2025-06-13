const { Drug, DrugDosage } = require('../models/pharmacy');
const { PrescriptionMedicament, DispensationMedicament, Ordonnance } = require('../models/prescription');
const { personne, patient } = require('../models/personne');
const { Op } = require('sequelize');
const database = require('../database');

/**
 * Search for drugs by a specific field.
 */
const searchDrugs = async (req, res) => {
  try {
    const { field, query } = req.query;

    const searchableFields = [
      'name',
      'genericName',
      'composition',
      'laboratory',
      'comment',
    ];

    if (!searchableFields.includes(field)) {
      return res.status(400).json({ message: 'Invalid search field' });
    }

    const whereClause = {
      [field]: { [Op.like]: `%${query}%` },
    };

    const drugs = await Drug.findAll({
      where: whereClause,
      include: DrugDosage,
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
      type,
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

    const newDrug = await Drug.create({
      type: type || 'drug',
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

    // res.status(201).json({ message: 'Drug created successfully', drug: newDrug });
    res.status(201).json({ message: 'Item created successfully', drug: newDrug });
  } catch (error) {
    console.error('Error creating drug:', error);
    res.status(500).json({ message: 'Error creating pharmacy item', error: error.message });
  }
};

/**
 * Edit an existing drug.
 */
const editDrug = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const drug = await Drug.findByPk(id);
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }

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
    const { id } = req.params;

    const drug = await Drug.findByPk(id);
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }

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
    const drugs = await Drug.findAll({
      include: DrugDosage,
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
    const { id } = req.params;

    const drug = await Drug.findByPk(id, {
      include: DrugDosage,
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
    const { drugId } = req.params;
    const { fromAge, toAge, dose } = req.body;

    const drug = await Drug.findByPk(drugId);
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }

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

    const dosages = await DrugDosage.findAll({
      where: { drugId: drugId },
      order: [['fromAge', 'ASC']]
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

/**
 * Get all ordonnances with detailed information
 */
const getAllOrdonnances = async (req, res) => {
  try {
    const { statut, dateDebut, dateFin } = req.query;

    let whereClause = {};
    if (statut) whereClause.statut = statut;
    if (dateDebut && dateFin) {
      whereClause.dateOrdonnance = {
        [Op.between]: [new Date(dateDebut), new Date(dateFin)]
      };
    }

    const ordonnances = await Ordonnance.findAll({
      where: whereClause,
      include: [
        {
          model: PrescriptionMedicament,
          include: [Drug]
        }
      ],
      order: [['dateOrdonnance', 'DESC']]
    });

    // Enrichir avec les informations du patient
    const ordonnancesEnrichies = await Promise.all(ordonnances.map(async (ordonnance) => {
      const infoPatient = await getPatientInfo(ordonnance.matriculePatient);
      return {
        ...ordonnance.toJSON(),
        patientInfo: infoPatient
      };
    }));

    res.status(200).json({ ordonnances: ordonnancesEnrichies });
  } catch (error) {
    console.error('Error fetching ordonnances:', error);
    res.status(500).json({
      message: 'Error fetching ordonnances',
      error: error.message
    });
  }
};

/**
 * Get ordonnance by ID
 */
const getOrdonnanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const ordonnance = await Ordonnance.findByPk(id, {
      include: [
        {
          model: PrescriptionMedicament,
          include: [
            {
              model: Drug,
              include: [DrugDosage]
            },
            {
              model: DispensationMedicament
            }
          ]
        }
      ]
    });

    if (!ordonnance) {
      return res.status(404).json({ message: 'Ordonnance not found' });
    }

    // Enrichir avec les informations du patient
    const infoPatient = await getPatientInfo(ordonnance.matriculePatient);

    res.status(200).json({
      ordonnance: {
        ...ordonnance.toJSON(),
        patientInfo: infoPatient
      }
    });
  } catch (error) {
    console.error('Error fetching ordonnance:', error);
    res.status(500).json({
      message: 'Error fetching ordonnance',
      error: error.message
    });
  }
};

/**
 * Dispenser des médicaments à partir d'une prescription
 */
const dispenserMedicament = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const {
      pharmacienId,
      quantiteDispensee,
      prixUnitaire,
      observations
    } = req.body;

    // Vérifier que la prescription existe
    const prescription = await PrescriptionMedicament.findByPk(prescriptionId, {
      include: [Drug]
    });

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Vérifier le stock disponible
    if (prescription.Drug.stock < quantiteDispensee) {
      return res.status(400).json({
        message: 'Stock insuffisant',
        stockDisponible: prescription.Drug.stock
      });
    }

    // Calculer le sous-total
    const sousTotal = quantiteDispensee * prixUnitaire;

    // Créer la dispensation dans une transaction
    const result = await database.transaction(async (t) => {
      // Créer la dispensation
      const dispensation = await DispensationMedicament.create({
        prescriptionMedicamentId: prescriptionId,
        pharmacienId,
        quantiteDispensee,
        prixUnitaire,
        sousTotal,
        observations
      }, { transaction: t });

      // Mettre à jour le stock
      await prescription.Drug.update({
        stock: prescription.Drug.stock - quantiteDispensee
      }, { transaction: t });

      // Calculer la quantité totale dispensée
      const totalDispense = await DispensationMedicament.sum('quantiteDispensee', {
        where: { prescriptionMedicamentId: prescriptionId },
        transaction: t
      });

      // Mettre à jour le statut de la prescription
      let nouveauStatut = 'prescrit';
      if (totalDispense >= prescription.quantitePrescrite) {
        nouveauStatut = 'entierement_servi';
      } else if (totalDispense > 0) {
        nouveauStatut = 'partiellement_servi';
      }

      await prescription.update({ statut: nouveauStatut }, { transaction: t });

      return dispensation;
    });

    res.status(201).json({
      message: 'Médicament dispensé avec succès',
      dispensation: result
    });
  } catch (error) {
    console.error('Error dispensing medication:', error);
    res.status(500).json({
      message: 'Error dispensing medication',
      error: error.message
    });
  }
};

/**
 * Get low stock drugs
 */
const getLowStockDrugs = async (req, res) => {
  try {
    const lowStockDrugs = await Drug.findAll({
      where: database.where(
        database.col('stock'),
        Op.lte,
        database.col('minStockThreshold')
      ),
      order: [['stock', 'ASC']]
    });

    res.status(200).json({ drugs: lowStockDrugs });
  } catch (error) {
    console.error('Error fetching low stock drugs:', error);
    res.status(500).json({
      message: 'Error fetching low stock drugs',
      error: error.message
    });
  }
};

/**
 * Get pharmacy statistics
 */
const getPharmacyStatistics = async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.query;

    let whereClause = {};
    if (dateDebut && dateFin) {
      whereClause.dateDispensation = {
        [Op.between]: [new Date(dateDebut), new Date(dateFin)]
      };
    }

    // Statistiques des dispensations
    const totalDispensations = await DispensationMedicament.count({
      where: whereClause
    });

    const chiffreAffaires = await DispensationMedicament.sum('sousTotal', {
      where: whereClause
    });

    // Médicaments les plus dispensés
    const topMedicaments = await DispensationMedicament.findAll({
      where: whereClause,
      include: [
        {
          model: PrescriptionMedicament,
          include: [Drug]
        }
      ],
      attributes: [
        [database.col('PrescriptionMedicament.Drug.name'), 'nomMedicament'],
        [database.fn('SUM', database.col('quantiteDispensee')), 'quantiteTotale'],
        [database.fn('SUM', database.col('sousTotal')), 'chiffreAffaires']
      ],
      group: ['PrescriptionMedicament.Drug.id'],
      order: [[database.fn('SUM', database.col('quantiteDispensee')), 'DESC']],
      limit: 10
    });

    // Stock critique
    const stockCritique = await Drug.count({
      where: database.where(
        database.col('stock'),
        Op.lte,
        database.col('minStockThreshold')
      )
    });

    res.status(200).json({
      totalDispensations,
      chiffreAffaires: chiffreAffaires || 0,
      topMedicaments,
      stockCritique
    });
  } catch (error) {
    console.error('Error fetching pharmacy statistics:', error);
    res.status(500).json({
      message: 'Error fetching pharmacy statistics',
      error: error.message
    });
  }
};

/**
 * Update drug stock
 */
const updateDrugStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantite, operation, motif } = req.body; // operation: 'add' ou 'subtract'

    const drug = await Drug.findByPk(id);
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }

    let newStock;
    if (operation === 'add') {
      newStock = drug.stock + quantite;
    } else if (operation === 'subtract') {
      if (drug.stock < quantite) {
        return res.status(400).json({ message: 'Stock insuffisant' });
      }
      newStock = drug.stock - quantite;
    } else {
      return res.status(400).json({ message: 'Operation invalide. Utilisez "add" ou "subtract"' });
    }

    await drug.update({ stock: newStock });

    res.status(200).json({
      message: 'Stock mis à jour avec succès',
      drug,
      motif
    });
  } catch (error) {
    console.error('Error updating drug stock:', error);
    res.status(500).json({
      message: 'Error updating drug stock',
      error: error.message
    });
  }
};

// Fonction utilitaire pour récupérer les infos patient
const getPatientInfo = async (matricule) => {
  try {
    const patientRecord = await patient.findOne({
      where: { matricule },
      include: [personne]
    });

    if (patientRecord && patientRecord.personne) {
      return {
        matricule,
        nom: patientRecord.personne.lastName,
        prenom: patientRecord.personne.firstName,
        sexe: patientRecord.personne.sex,
        dateNaissance: patientRecord.personne.birthDate,
        telephone: patientRecord.personne.tel,
        email: patientRecord.personne.email
      };
    }
    return null;
  } catch (error) {
    console.error('Erreur récupération info patient:', error);
    return null;
  }
};

module.exports = {
  createDrug,
  editDrug,
  deleteDrug,
  getAllDrugs,
  getDrugById,
  searchDrugs,
  addDrugDosage,
  getDrugDosages,
  getAllOrdonnances,
  getOrdonnanceById,
  dispenserMedicament,
  getLowStockDrugs,
  getPharmacyStatistics,
  updateDrugStock
};
