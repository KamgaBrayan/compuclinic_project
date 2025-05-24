const { typeExamen } = require('../models/examen');
const database = require('../database');

// Examens adaptés aux hôpitaux africains
const examensAfricains = [
    // Hématologie
    {
        nom: 'Hémogramme complet (NFS)',
        categorie: 'Hématologie',
        prix: 2500,
        dureeEstimee: 30,
        description: 'Numération formule sanguine complète',
        prerequis: 'Aucun',
        materielNecessaire: 'Tube EDTA, automate d\'hématologie'
    },
    {
        nom: 'Groupe sanguin ABO + Rhésus',
        categorie: 'Hématologie',
        prix: 1500,
        dureeEstimee: 20,
        description: 'Détermination du groupe sanguin et facteur Rhésus',
        prerequis: 'Aucun',
        materielNecessaire: 'Sérums anti-A, anti-B, anti-D'
    },
    {
        nom: 'Temps de coagulation',
        categorie: 'Hématologie',
        prix: 1000,
        dureeEstimee: 15,
        description: 'Test de coagulation sanguine',
        prerequis: 'Aucun',
        materielNecessaire: 'Tube citrate'
    },

    // Biochimie
    {
        nom: 'Glycémie à jeun',
        categorie: 'Biochimie',
        prix: 1000,
        dureeEstimee: 15,
        description: 'Dosage du glucose sanguin',
        prerequis: 'Patient à jeun depuis 12h',
        materielNecessaire: 'Tube sec, glucose oxydase'
    },
    {
        nom: 'Créatininémie',
        categorie: 'Biochimie',
        prix: 1500,
        dureeEstimee: 20,
        description: 'Dosage de la créatinine pour fonction rénale',
        prerequis: 'Aucun',
        materielNecessaire: 'Tube sec, réactif créatinine'
    },
    {
        nom: 'Transaminases (ALAT/ASAT)',
        categorie: 'Biochimie',
        prix: 2000,
        dureeEstimee: 25,
        description: 'Enzymes hépatiques',
        prerequis: 'Aucun',
        materielNecessaire: 'Tube sec, kit transaminases'
    },
    {
        nom: 'Cholestérol total',
        categorie: 'Biochimie',
        prix: 1200,
        dureeEstimee: 20,
        description: 'Dosage du cholestérol sanguin',
        prerequis: 'Patient à jeun depuis 12h',
        materielNecessaire: 'Tube sec, réactif cholestérol'
    },

    // Parasitologie
    {
        nom: 'Goutte épaisse (Paludisme)',
        categorie: 'Parasitologie',
        prix: 1000,
        dureeEstimee: 30,
        description: 'Recherche de parasites du paludisme',
        prerequis: 'Aucun',
        materielNecessaire: 'Lames, colorant Giemsa, microscope'
    },
    {
        nom: 'Test de diagnostic rapide (TDR) Paludisme',
        categorie: 'Parasitologie',
        prix: 1500,
        dureeEstimee: 10,
        description: 'Test rapide pour paludisme',
        prerequis: 'Aucun',
        materielNecessaire: 'Cassette TDR, tampons'
    },
    {
        nom: 'Examen parasitologique des selles',
        categorie: 'Parasitologie',
        prix: 1000,
        dureeEstimee: 20,
        description: 'Recherche de parasites intestinaux',
        prerequis: 'Selles fraîches',
        materielNecessaire: 'Lames, lugol, microscope'
    },

    // Microbiologie
    {
        nom: 'ECBU (Examen cytobactériologique des urines)',
        categorie: 'Microbiologie',
        prix: 2000,
        dureeEstimee: 48,
        description: 'Culture d\'urine et antibiogramme',
        prerequis: 'Toilette génitale, premier jet éliminé',
        materielNecessaire: 'Milieux de culture, étuve'
    },
    {
        nom: 'Crachat (BK)',
        categorie: 'Microbiologie',
        prix: 1500,
        dureeEstimee: 60,
        description: 'Recherche de bacilles tuberculeux',
        prerequis: 'Crachat matinal',
        materielNecessaire: 'Colorant Ziehl, microscope'
    },

    // Immunologie
    {
        nom: 'Test VIH (ELISA)',
        categorie: 'Immunologie',
        prix: 3000,
        dureeEstimee: 120,
        description: 'Dépistage du VIH',
        prerequis: 'Consentement éclairé',
        materielNecessaire: 'Kit ELISA, spectrophotomètre'
    },
    {
        nom: 'Test rapide VIH',
        categorie: 'Immunologie',
        prix: 2000,
        dureeEstimee: 15,
        description: 'Test rapide de dépistage VIH',
        prerequis: 'Consentement éclairé',
        materielNecessaire: 'Test rapide, lancette'
    },
    {
        nom: 'Hépatite B (HBsAg)',
        categorie: 'Immunologie',
        prix: 2500,
        dureeEstimee: 30,
        description: 'Dépistage hépatite B',
        prerequis: 'Aucun',
        materielNecessaire: 'Test rapide ou ELISA'
    },

    // Imagerie (si disponible)
    {
        nom: 'Radiographie thoracique',
        categorie: 'Imagerie',
        prix: 5000,
        dureeEstimee: 15,
        description: 'Radio du thorax face et profil',
        prerequis: 'Retirer bijoux et objets métalliques',
        materielNecessaire: 'Appareil radiologique, films'
    },
    {
        nom: 'Échographie abdominale',
        categorie: 'Imagerie',
        prix: 8000,
        dureeEstimee: 30,
        description: 'Exploration échographique abdominale',
        prerequis: 'Vessie pleine pour pelvis',
        materielNecessaire: 'Échographe, gel'
    }
];

const initializeExamens = async () => {
    try {
        await database.sync();
        
        console.log('Initialisation des types d\'examens...');
        
        for (const examenData of examensAfricains) {
            const [examen, created] = await typeExamen.findOrCreate({
                where: { nom: examenData.nom },
                defaults: examenData
            });
            
            if (created) {
                console.log(`✓ Examen créé: ${examenData.nom}`);
            } else {
                console.log(`- Examen existant: ${examenData.nom}`);
            }
        }
        
        console.log('Initialisation terminée!');
        console.log(`Total des examens disponibles: ${examensAfricains.length}`);
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
    }
};

// Exécuter si appelé directement
if (require.main === module) {
    initializeExamens().then(() => process.exit(0));
}

module.exports = { initializeExamens, examensAfricains };