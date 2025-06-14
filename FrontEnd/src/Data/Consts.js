import { useEffect, useState } from "react";

export const wServerRoot = "http://127.0.0.1:8000/api";
export const BASE_URL = `${wServerRoot}/pharmacy`;

export const wServer = {
    // LOGIN : `${wServerRoot}/auth/login/`,
    LOGIN : `${wServerRoot}/auth/signin`,
    REGISTER : `${wServerRoot}/auth/signup`,
    GET : {
        LOGGED_IN : `${wServerRoot}/auth/log/`,
        PATIENT : {
            ALL : `${wServerRoot}/secretaire/getPatients/`,
            // Ancienne route pour le profil, potentiellement utilisée ailleurs (POST avec matricule dans le body)
            PROFILE : (id="") => `${wServerRoot}/secretaire/patient/${id}/`, // Laissé tel quel pour compatibilité, mais l'appel doit être un POST avec body.
            // Nouvelle route pour le profil patient, utilisant GET avec matricule dans l'URL (plus RESTful)
            PROFILE_BY_MATRICULE_V2 : (matricule) => `${wServerRoot}/secretaire/getPatientById/${matricule}`, // Assumant que le backend sera ajusté pour GET /:matricule
            INTERNED : `${wServerRoot}/secretaire/patients/?statut=Interne`,
            EXTERNED : `${wServerRoot}/secretaire/patients/?statut=Externe`,
        },
        PLATEAU_TECHNIQUE : ``, // Reste vide si non défini
        SCHEDULES : `${wServerRoot}/utils/schedules/`,
        // Ancienne route, potentiellement utilisée (GET avec ID dans l'URL, mais backend pour cela non identifié clairement)
        CONSULTATION : (filter="") => `${wServerRoot}/consultations/consultations/?${filter}`,
        CONSULTATION_SINGLE : (id="") => `${wServerRoot}/consultations/consultations/${id}/`, // Backend pour cette route spécifique à vérifier
        // Nouvelle route pour récupérer une consultation unique par ID (si implémentée au backend)
        CONSULTATION_BY_ID_V2 : (id) => `${wServerRoot}/medecin/consultation/${id}`, // Hypothétique, backend à confirmer/créer
        DOCTORS : `${wServerRoot}/grh/medecins/`,
        SECRETARIES : `${wServerRoot}/grh/secretaires/`,
        CAISHIERS : `${wServerRoot}/grh/caissiers/`,
        NURSES : `${wServerRoot}/grh/infirmiers/`,
        LABORATORIES : `${wServerRoot}/grh/laborantins/`,
        EMPLOYEE : `${wServerRoot}/grh/personnels/`,
        DOCTOR_PROFILE : (id) => `${wServerRoot}/grh/medecins/${id}/`,
        ALLCONSULTATIONS :`${wServerRoot}/medecin/getConsultations/`, // Note: quasi identique à MEDECIN.CONSULTATIONS ci-dessous

        PHARMACY: {
            ALL: `${BASE_URL}/drugs`,
            SEARCH: `${BASE_URL}/drugs/search`, // ex: ?field=name&query=paracetamol
            BY_ID: (id) => `${BASE_URL}/drugs/${id}`,
            DOSAGE: (drugId) => `${BASE_URL}/drugs/${drugId}/dosage`,
            LOW_STOCK: `${BASE_URL}/drugs/low-stock`,
            ORDONNANCES: `${BASE_URL}/ordonnances`, // Pour obtenir toutes les ordonnances (pharmacien)
            ORDONNANCE_BY_ID: (id) => `${BASE_URL}/ordonnances/${id}`,
            STATISTICS: `${BASE_URL}/statistics`,
            // INVOICES - Si la gestion des factures pharmacie est séparée
            // INVOICES: `${BASE_URL}/invoices`,
            // INVOICE: (id) => `${BASE_URL}/invoices/${id}`,
            // SEARCH_INVOICES: `${BASE_URL}/invoices/search`,
        },

        MEDECIN: {
            CONSULTATIONS: `${wServerRoot}/medecin/getConsultations`,
            TYPES_EXAMENS: `${wServerRoot}/medecin/types-examens`,
            PRESCRIPTIONS_EXAMENS_PATIENT: (matricule) => `${wServerRoot}/medecin/prescriptions-examens/${matricule}`,
            MEDICAMENTS_DISPONIBLES: `${wServerRoot}/medecin/medicaments`,
            ORDONNANCES_PATIENT: (matricule) => `${wServerRoot}/medecin/ordonnances/${matricule}`,
            GEMINI: `${wServerRoot}/medecin/getGemini`, // GET ou POST ? Si POST, à déplacer
        },

        LABORANTIN: {
            TYPES_EXAMENS: `${wServerRoot}/laborantin/types-examens`, // Liste tous les types d'examens
            TYPE_EXAMEN_BY_ID: (id) => `${wServerRoot}/laborantin/types-examens/${id}`, // Pour obtenir un type d'examen spécifique
            TYPES_EXAMENS_PARAMETRES: (typeExamenId) => `${wServerRoot}/laborantin/types-examens/${typeExamenId}/parametres`,
            PRESCRIPTIONS_EN_ATTENTE: `${wServerRoot}/laborantin/prescriptions`, // ex: ?statut=paye
            RESULTATS_PATIENT: (matricule) => `${wServerRoot}/laborantin/resultats/patient/${matricule}`,
            RESULTAT_EXAMEN_BY_ID: (id) => `${wServerRoot}/laborantin/resultats/${id}`,
            STATISTIQUES: `${wServerRoot}/laborantin/statistiques`,
        }
    },
    CREATE : { // Devrait être principalement pour les requêtes POST pour créer des ressources
        USER : `${wServerRoot}/auth/login/`, // Semble incorrect pour "CREATE", plus pour login. REGISTER est séparé.
        SANDBOX : `${wServerRoot}/grh/sandbox/`,
        PERSONNEL : `${wServerRoot}/grh/personnels/`,
        DOCTOR : `${wServerRoot}/grh/medecins/`,
        CONSULTATION : `${wServerRoot}/consultations/consultation/new/`, // Création de consultation par la secrétaire ?
        NURSE : `${wServerRoot}/grh/infirmiers/`,
        SECRETARY : `${wServerRoot}/grh/secretaires/`,
        PATIENT : `${wServerRoot}/secretaire/addUnExistingPatient/`, // POST
        // PATIENT_LAB: `${wServerRoot}/patients/lab`, // Ces routes PATIENT_* sont-elles utilisées / définies au backend?
        // PATIENT_PLATEAU: `${wServerRoot}/patients/plateau`,
        // PATIENT_MEDECIN: `${wServerRoot}/patients/medecin`,
        // PATIENT_INFIRMIER: `${wServerRoot}/patients/infirmier`,

        PHARMACY: {
            DRUG: `${BASE_URL}/drugs`, // POST pour créer un médicament
            DOSAGE: (drugId) => `${BASE_URL}/drugs/${drugId}/dosage`, // POST pour ajouter un dosage
            // INVOICE: `${BASE_URL}/invoices`, // Si gestion factures pharmacie
            // CREATE_INVOICE: `${BASE_URL}/invoices` // Redondant avec INVOICE ci-dessus
        },

        MEDECIN: {
            PRESCRIRE_EXAMEN: `${wServerRoot}/medecin/prescrire-examen`, // POST
            CREER_ORDONNANCE: `${wServerRoot}/medecin/creer-ordonnance`, // POST
        },

        LABORANTIN: {
            TYPE_EXAMEN: `${wServerRoot}/laborantin/types-examens`, // POST pour créer un type d'examen
            PARAMETRE_EXAMEN: (typeExamenId) => `${wServerRoot}/laborantin/types-examens/${typeExamenId}/parametres`, // POST
            SAISIR_RESULTATS: (prescriptionId) => `${wServerRoot}/laborantin/prescriptions/${prescriptionId}/resultats`, // POST pour saisir (créer) des résultats
        }
    },
    // POST: { // Cette section peut être fusionnée avec CREATE ou gardée si la distinction est claire
    //     PHARMACY: {
    //         ADD: `${BASE_URL}/drugs`, // Redondant avec CREATE.PHARMACY.DRUG
    //         DOSAGE: (drugId) => `${BASE_URL}/drugs/${drugId}/dosage`, // Redondant
    //         INVOICE: `${BASE_URL}/invoices`, // Redondant
    //         CREATE_INVOICE: `${BASE_URL}/invoices`, // Redondant
    //         DISPENSER_MEDICAMENT: (prescriptionId) => `${BASE_URL}/prescriptions/${prescriptionId}/dispenser`, // POST, spécifique et important
    //     }
    // },
    // Nouvelle section pour les actions spécifiques POST qui ne sont pas de la pure création
    ACTION_POST: {
        PHARMACY: {
            DISPENSER_MEDICAMENT: (prescriptionId) => `${BASE_URL}/prescriptions/${prescriptionId}/dispenser`,
        },
        SECRETAIRE: {
             // Si getPatientById reste en POST pour compatibilité
            GET_PATIENT_BY_ID_POST_V1: `${wServerRoot}/secretaire/getPatientById/`
        },
        MEDECIN: {
            GEMINI: `${wServerRoot}/medecin/gemini`,
        },

    PUT: { // Pour les mises à jour complètes de ressources existantes
        PHARMACY: {
            DRUG: (id) => `${BASE_URL}/drugs/${id}`, // Mettre à jour un médicament
            STOCK: (id) => `${BASE_URL}/drugs/${id}/stock`, // Mettre à jour le stock (ajouter/soustraire)
            // INVOICE_STATUS: (id) => `${BASE_URL}/invoices/${id}/status`, // Si gestion factures
            // UPDATE_INVOICE_STATUS: (id) => `${BASE_URL}/invoices/${id}/status` // Redondant
        },

        MEDECIN: {
            UPDATE_CONSULTATION_RESULT: `${wServerRoot}/medecin/updateResultConsultation`, // Mettre à jour diag/presc d'une consult
            CHANGE_CONSULTATION_STATE: `${wServerRoot}/medecin/changestate`, // Changer statut consult (EnAttente, EnCours, Terminer)
        },

        INFIRMIERE: {
            ADD_PATIENT_PARAMETERS: `${wServerRoot}/infirmiere/addPatientParameters`, // Met à jour une consult existante avec les params
        },

        LABORANTIN: {
            TYPE_EXAMEN: (id) => `${wServerRoot}/laborantin/types-examens/${id}`, // Mettre à jour un type d'examen
            PARAMETRE_EXAMEN: (id) => `${wServerRoot}/laborantin/parametres/${id}`, // Mettre à jour un paramètre
            COMMENCER_EXAMEN: (prescriptionId) => `${wServerRoot}/laborantin/prescriptions/${prescriptionId}/commencer`, // Met à jour statut prescription
            VALIDER_RESULTATS: (prescriptionId) => `${wServerRoot}/laborantin/prescriptions/${prescriptionId}/valider`, // Met à jour résultat + statut prescription
            UPDATE_RESULTATS: (resultatId) => `${wServerRoot}/laborantin/resultats/${resultatId}`, // Pour mettre à jour un résultat existant (si nécessaire)
        },
        PATIENT_UPDATE_BY_ID_V1 :`${wServerRoot}/secretaire/updatePatientById`, // Route existante pour maj patient
    },
    UPDATE : { // Cette section peut être fusionnée avec PUT ou PATCH si on suit les conventions HTTP
         USER : `${wServerRoot}/auth/login/`, // Incorrect pour update
         PATIENT : {
             INTERN : (id="") => `${wServerRoot}/secretaire/patients/${id}/`,
             ADD_EXIST : (id="") => `${wServerRoot}/secretaire/addExistingPatient/${id}/`,
             UPDATE_BY_ID :`${wServerRoot}/secretaire/updatePatientById`, // Déjà dans PUT via PATIENT_UPDATE_BY_ID_V1
             UPDATE_PARAMETERS :`${wServerRoot}/infirmiere/addPatientParameters`, // Déjà dans PUT.INFIRMIERE
             EXTERN : (id="") => `${wServerRoot}/secretaire/patients/${id}/`,
         },
         UPDATECONSULTATION : `${wServerRoot}/medecin/updateResultConsultation/`, // Déjà dans PUT.MEDECIN
         UPDATESTATECONSULTATION: `${wServerRoot}/medecin/changestate`, // Déjà dans PUT.MEDECIN
         PHARMACY: {
             DRUG: (id) => `${BASE_URL}/drugs/${id}` // Déjà dans PUT.PHARMACY
         },
     },
    DELETE : {
        USER :  {
            // DELETE_BY_ID : (id="") => `${wServerRoot}/secretaire/deleteUserById/${id}/` // Route pour user non trouvée au backend
        },
        PATIENT : {
            // Ancienne route (si utilisée, ne prend pas d'ID dans l'URL)
            DELETE_BY_ID : `${wServerRoot}/secretaire/deletePatientById`,
            // Nouvelle route, avec matricule dans l'URL
            DELETE_BY_MATRICULE_V2 : (matricule) => `${wServerRoot}/secretaire/deletePatientById/${matricule}`
        },
        PHARMACY: {
            DRUG: (id) => `${BASE_URL}/drugs/${id}`
        },
        LABORANTIN: {
            TYPE_EXAMEN: (id) => `${wServerRoot}/laborantin/types-examens/${id}`,
            PARAMETRE_EXAMEN: (id) => `${wServerRoot}/laborantin/parametres/${id}`,
        }
    }
}
}

export const wapp = {
    CURRENT_PAGE : `${window.location.href}`,

    DASHBOARD : "/dashboard",
    USER : {
        LOGIN : "/login",
        LOGOUT : "/logout",
        REGISTRATION : "/registration",
        RESET_PASSWORD : "/resetpassword",
    },
    DEPARTMENT :{
        ALL: "/departments",
        SECRETARY : "/secretaire",
        CAISSE : "/caissier",
        INFIRMERIE : "/infirmier",
        MEDECINE : "/medicine",
        PLATEAU_TECHNIQUE : "/plateautechnique", // Doit correspondre à une section de l'app
        LABORANTIN : "/laborantin", // Renommé pour correspondre à GET.LABORANTIN
        GRH : "/ressourcehumain",
        PHARMACIE: "/pharmacie", // Ajout pour la section pharmacie
    },
    // COMPTABILITE semble être une copie de DEPARTMENT, à vérifier si c'est intentionnel
    COMPTABILITE :{
        ALL: "/comptabilite",
        SECRETARY : "/secretaire",
        CAISSE : "/caissier",
        INFIRMERIE : "/infirmier",
        MEDECINE : "/medicine",
        PLATEAU_TECHNIQUE : "/plateautechnique",
        LABORANTIN : "/laborantin",
        GRH : "/ressourcehumain",
    },
    DOCTOR : { // Routes pour la gestion des docteurs (GRH)
        ALL : "/grh/medecins/liste", // Exemple de route plus spécifique
        ADD : "/grh/medecins/ajouter",
        PROFILE : (id='#') => `/grh/medecins/${id}`,
        // SCHEDULE : "#", // Si gestion d'horaires
    },
    PATIENT : { // Routes pour la section secrétaire/patient
        ALL : "/secretaire/patients/liste", // Ajusté pour plus de clarté
        // INTERED et EXTERNED pointent vers la même liste, filtrage sur la page
        INTERNED : "/secretaire/patients/liste?statut=Interne", // Exemple avec query param
        EXTERNED : "/secretaire/patients/liste?statut=Externe",
        ADD : "/secretaire/patients/ajouter",
        PROFILE : (id='#') => `/secretaire/patients/${id}` // id ici est souvent le matricule
    },
    // Routes pour la section Médecine (Consultations)
    MEDECINE_CONSULTATION : (id='#') => `/medecine/consultations/${id}`, // Renommé pour clarté
    MEDECINE_NOUVELLE_PRESCRIPTION_EXAMEN: (consultationId) => `/medecine/consultations/${consultationId}/prescrire-examen`,
    MEDECINE_NOUVELLE_ORDONNANCE: (consultationId) => `/medecine/consultations/${consultationId}/creer-ordonnance`,

    GRH : { // Routes pour la Gestion des Ressources Humaines
        ALL_PERSONNEL : "/grh/personnels/liste",
        ADD_PERSONNEL : "/grh/personnels/ajouter",
        PROFILE_PERSONNEL : (id='#') => `/grh/personnels/${id}`
        // ... autres routes GRH (medecins, infirmiers etc. peuvent être ici ou dans leurs sections)
    },
    PHARMACY : { // Routes pour la section Pharmacie
        GESTION_STOCK : "/pharmacie/stock",
        AJOUTER_MEDICAMENT : "/pharmacie/stock/ajouter",
        EDITER_MEDICAMENT : (id) => `/pharmacie/stock/editer/${id}`,
        DISPENSATION_ORDONNANCES : "/pharmacie/dispensation",
        VOIR_ORDONNANCE : (id) => `/pharmacie/dispensation/ordonnances/${id}`,
        STATISTIQUES : "/pharmacie/statistiques",
        MEDICAMENTS_STOCK_FAIBLE: "/pharmacie/alertes/stock-faible",
    },
    LABORANTIN : { // Routes pour la section Laboratoire
        TABLEAU_DE_BORD: "/laboratoire/dashboard", // Une page d'accueil pour le laborantin
        GESTION_TYPES_EXAMENS : "/laboratoire/admin/types-examens",
        AJOUTER_TYPE_EXAMEN : "/laboratoire/admin/types-examens/ajouter",
        EDITER_TYPE_EXAMEN : (id) => `/laboratoire/admin/types-examens/editer/${id}`,
        PRESCRIPTIONS_A_TRAITER : "/laboratoire/prescriptions", // Liste des examens à faire (statut payé)
        SAISIR_RESULTATS_EXAMEN : (prescriptionId) => `/laboratoire/prescriptions/${prescriptionId}/resultats/saisir`,
        VOIR_RESULTATS_EXAMEN : (resultatId) => `/laboratoire/resultats/${resultatId}`,
        HISTORIQUE_RESULTATS_PATIENT: (matricule) => `/laboratoire/patients/${matricule}/resultats`,
        STATISTIQUES : "/laboratoire/statistiques"
    },
    CAISSE: {
        ENCAISSEMENT_EXAMEN: "/caisse/examens/paiement",
        ENCAISSEMENT_PHARMACIE: "/caisse/pharmacie/paiement", // Si les paiements pharmacie passent par la caisse centrale
        HISTORIQUE_TRANSACTIONS: "/caisse/historique"
    },
    redirectTo : (url="#") => {
        window.location.assign(url);
    }
};

// ... (Countries, Languages, TimeZones, Postes, Services, PatientStatus, BillStatus restent les mêmes)
export const Countries = [
    // {code:"00",name:"-- Select Country --"},
    {code:"AF",name:"Afghanistan"},
    {code:"AX",name:"Åland Islands"},
    {code:"AL",name:"Albania"},
    {code:"DZ",name:"Algeria"},
    {code:"AS",name:"American Samoa"},
    {code:"AD",name:"Andorra"},
    {code:"AO",name:"Angola"},
    {code:"AI",name:"Anguilla"},
    {code:"AQ",name:"Antarctica"},
    {code:"AG",name:"Antigua and Barbuda"},
    {code:"AR",name:"Argentina"},
    {code:"AM",name:"Armenia"},
    {code:"AW",name:"Aruba"},
    {code:"AU",name:"Australia"},
    {code:"AT",name:"Austria"},
    {code:"AZ",name:"Azerbaijan"},
    {code:"BS",name:"Bahamas"},
    {code:"BH",name:"Bahrain"},
    {code:"BD",name:"Bangladesh"},
    {code:"BB",name:"Barbados"},
    {code:"BY",name:"Belarus"},
    {code:"BE",name:"Belgium"},
    {code:"BZ",name:"Belize"},
    {code:"BJ",name:"Benin"},
    {code:"BM",name:"Bermuda"},
    {code:"BT",name:"Bhutan"},
    {code:"BO",name:"Bolivia, Plurinational State of"},
    {code:"BQ",name:"Bonaire, Sint Eustatius and Saba"},
    {code:"BA",name:"Bosnia and Herzegovina"},
    {code:"BW",name:"Botswana"},
    {code:"BV",name:"Bouvet Island"},
    {code:"BR",name:"Brazil"},
    {code:"IO",name:"British Indian Ocean Territory"},
    {code:"BN",name:"Brunei Darussalam"},
    {code:"BG",name:"Bulgaria"},
    {code:"BF",name:"Burkina Faso"},
    {code:"BI",name:"Burundi"},
    {code:"KH",name:"Cambodia"},
    {code:"CM",name:"Cameroon"},
    {code:"CA",name:"Canada"},
    {code:"CV",name:"Cape Verde"},
    {code:"KY",name:"Cayman Islands"},
    {code:"CF",name:"Central African Republic"},
    {code:"TD",name:"Chad"},
    {code:"CL",name:"Chile"},
    {code:"CN",name:"China"},
    {code:"CX",name:"Christmas Island"},
    {code:"CC",name:"Cocos (Keeling) Islands"},
    {code:"CO",name:"Colombia"},
    {code:"KM",name:"Comoros"},
    {code:"CG",name:"Congo"},
    {code:"CD",name:"Congo, the Democratic Republic of the"},
    {code:"CK",name:"Cook Islands"},
    {code:"CR",name:"Costa Rica"},
    {code:"CI",name:"Côte d'Ivoire"},
    {code:"HR",name:"Croatia"},
    {code:"CU",name:"Cuba"},
    {code:"CW",name:"Curaçao"},
    {code:"CY",name:"Cyprus"},
    {code:"CZ",name:"Czech Republic"},
    {code:"DK",name:"Denmark"},
    {code:"DJ",name:"Djibouti"},
    {code:"DM",name:"Dominica"},
    {code:"DO",name:"Dominican Republic"},
    {code:"EC",name:"Ecuador"},
    {code:"EG",name:"Egypt"},
    {code:"SV",name:"El Salvador"},
    {code:"GQ",name:"Equatorial Guinea"},
    {code:"ER",name:"Eritrea"},
    {code:"EE",name:"Estonia"},
    {code:"ET",name:"Ethiopia"},
    {code:"FK",name:"Falkland Islands (Malvinas)"},
    {code:"FO",name:"Faroe Islands"},
    {code:"FJ",name:"Fiji"},
    {code:"FI",name:"Finland"},
    {code:"FR",name:"France"},
    {code:"GF",name:"French Guiana"},
    {code:"PF",name:"French Polynesia"},
    {code:"TF",name:"French Southern Territories"},
    {code:"GA",name:"Gabon"},
    {code:"GM",name:"Gambia"},
    {code:"GE",name:"Georgia"},
    {code:"DE",name:"Germany"},
    {code:"GH",name:"Ghana"},
    {code:"GI",name:"Gibraltar"},
    {code:"GR",name:"Greece"},
    {code:"GL",name:"Greenland"},
    {code:"GD",name:"Grenada"},
    {code:"GP",name:"Guadeloupe"},
    {code:"GU",name:"Guam"},
    {code:"GT",name:"Guatemala"},
    {code:"GG",name:"Guernsey"},
    {code:"GN",name:"Guinea"},
    {code:"GW",name:"Guinea-Bissau"},
    {code:"GY",name:"Guyana"},
    {code:"HT",name:"Haiti"},
    {code:"HM",name:"Heard Island and McDonald Islands"},
    {code:"VA",name:"Holy See (Vatican City State)"},
    {code:"HN",name:"Honduras"},
    {code:"HK",name:"Hong Kong"},
    {code:"HU",name:"Hungary"},
    {code:"IS",name:"Iceland"},
    {code:"IN",name:"India"},
    {code:"ID",name:"Indonesia"},
    {code:"IR",name:"Iran, Islamic Republic of"},
    {code:"IQ",name:"Iraq"},
    {code:"IE",name:"Ireland"},
    {code:"IM",name:"Isle of Man"},
    {code:"IL",name:"Israel"},
    {code:"IT",name:"Italy"},
    {code:"JM",name:"Jamaica"},
    {code:"JP",name:"Japan"},
    {code:"JE",name:"Jersey"},
    {code:"JO",name:"Jordan"},
    {code:"KZ",name:"Kazakhstan"},
    {code:"KE",name:"Kenya"},
    {code:"KI",name:"Kiribati"},
    {code:"KP",name:"Korea, Democratic People's Republic of"},
    {code:"KR",name:"Korea, Republic of"},
    {code:"KW",name:"Kuwait"},
    {code:"KG",name:"Kyrgyzstan"},
    {code:"LA",name:"Lao People's Democratic Republic"},
    {code:"LV",name:"Latvia"},
    {code:"LB",name:"Lebanon"},
    {code:"LS",name:"Lesotho"},
    {code:"LR",name:"Liberia"},
    {code:"LY",name:"Libya"},
    {code:"LI",name:"Liechtenstein"},
    {code:"LT",name:"Lithuania"},
    {code:"LU",name:"Luxembourg"},
    {code:"MO",name:"Macao"},
    {code:"MK",name:"Macedonia, the former Yugoslav Republic of"},
    {code:"MG",name:"Madagascar"},
    {code:"MW",name:"Malawi"},
    {code:"MY",name:"Malaysia"},
    {code:"MV",name:"Maldives"},
    {code:"ML",name:"Mali"},
    {code:"MT",name:"Malta"},
    {code:"MH",name:"Marshall Islands"},
    {code:"MQ",name:"Martinique"},
    {code:"MR",name:"Mauritania"},
    {code:"MU",name:"Mauritius"},
    {code:"YT",name:"Mayotte"},
    {code:"MX",name:"Mexico"},
    {code:"FM",name:"Micronesia, Federated States of"},
    {code:"MD",name:"Moldova, Republic of"},
    {code:"MC",name:"Monaco"},
    {code:"MN",name:"Mongolia"},
    {code:"ME",name:"Montenegro"},
    {code:"MS",name:"Montserrat"},
    {code:"MA",name:"Morocco"},
    {code:"MZ",name:"Mozambique"},
    {code:"MM",name:"Myanmar"},
    {code:"NA",name:"Namibia"},
    {code:"NR",name:"Nauru"},
    {code:"NP",name:"Nepal"},
    {code:"NL",name:"Netherlands"},
    {code:"NC",name:"New Caledonia"},
    {code:"NZ",name:"New Zealand"},
    {code:"NI",name:"Nicaragua"},
    {code:"NE",name:"Niger"},
    {code:"NG",name:"Nigeria"},
    {code:"NU",name:"Niue"},
    {code:"NF",name:"Norfolk Island"},
    {code:"MP",name:"Northern Mariana Islands"},
    {code:"NO",name:"Norway"},
    {code:"OM",name:"Oman"},
    {code:"PK",name:"Pakistan"},
    {code:"PW",name:"Palau"},
    {code:"PS",name:"Palestinian Territory, Occupied"},
    {code:"PA",name:"Panama"},
    {code:"PG",name:"Papua New Guinea"},
    {code:"PY",name:"Paraguay"},
    {code:"PE",name:"Peru"},
    {code:"PH",name:"Philippines"},
    {code:"PN",name:"Pitcairn"},
    {code:"PL",name:"Poland"},
    {code:"PT",name:"Portugal"},
    {code:"PR",name:"Puerto Rico"},
    {code:"QA",name:"Qatar"},
    {code:"RE",name:"Réunion"},
    {code:"RO",name:"Romania"},
    {code:"RU",name:"Russian Federation"},
    {code:"RW",name:"Rwanda"},
    {code:"BL",name:"Saint Barthélemy"},
    {code:"SH",name:"Saint Helena, Ascension and Tristan da Cunha"},
    {code:"KN",name:"Saint Kitts and Nevis"},
    {code:"LC",name:"Saint Lucia"},
    {code:"MF",name:"Saint Martin (French part)"},
    {code:"PM",name:"Saint Pierre and Miquelon"},
    {code:"VC",name:"Saint Vincent and the Grenadines"},
    {code:"WS",name:"Samoa"},
    {code:"SM",name:"San Marino"},
    {code:"ST",name:"Sao Tome and Principe"},
    {code:"SA",name:"Saudi Arabia"},
    {code:"SN",name:"Senegal"},
    {code:"RS",name:"Serbia"},
    {code:"SC",name:"Seychelles"},
    {code:"SL",name:"Sierra Leone"},
    {code:"SG",name:"Singapore"},
    {code:"SX",name:"Sint Maarten (Dutch part)"},
    {code:"SK",name:"Slovakia"},
    {code:"SI",name:"Slovenia"},
    {code:"SB",name:"Solomon Islands"},
    {code:"SO",name:"Somalia"},
    {code:"ZA",name:"South Africa"},
    {code:"GS",name:"South Georgia and the South Sandwich Islands"},
    {code:"SS",name:"South Sudan"},
    {code:"ES",name:"Spain"},
    {code:"LK",name:"Sri Lanka"},
    {code:"SD",name:"Sudan"},
    {code:"SR",name:"Suriname"},
    {code:"SJ",name:"Svalbard and Jan Mayen"},
    {code:"SZ",name:"Swaziland"},
    {code:"SE",name:"Sweden"},
    {code:"CH",name:"Switzerland"},
    {code:"SY",name:"Syrian Arab Republic"},
    {code:"TW",name:"Taiwan, Province of China"},
    {code:"TJ",name:"Tajikistan"},
    {code:"TZ",name:"Tanzania, United Republic of"},
    {code:"TH",name:"Thailand"},
    {code:"TL",name:"Timor-Leste"},
    {code:"TG",name:"Togo"},
    {code:"TK",name:"Tokelau"},
    {code:"TO",name:"Tonga"},
    {code:"TT",name:"Trinidad and Tobago"},
    {code:"TN",name:"Tunisia"},
    {code:"TR",name:"Turkey"},
    {code:"TM",name:"Turkmenistan"},
    {code:"TC",name:"Turks and Caicos Islands"},
    {code:"TV",name:"Tuvalu"},
    {code:"UG",name:"Uganda"},
    {code:"UA",name:"Ukraine"},
    {code:"AE",name:"United Arab Emirates"},
    {code:"GB",name:"United Kingdom"},
    {code:"US",name:"United States"},
    {code:"UM",name:"United States Minor Outlying Islands"},
    {code:"UY",name:"Uruguay"},
    {code:"UZ",name:"Uzbekistan"},
    {code:"VU",name:"Vanuatu"},
    {code:"VE",name:"Venezuela, Bolivarian Republic of"},
    {code:"VN",name:"Viet Nam"},
    {code:"VG",name:"Virgin Islands, British"},
    {code:"VI",name:"Virgin Islands, U.S."},
    {code:"WF",name:"Wallis and Futuna"},
    {code:"EH",name:"Western Sahara"},
    {code:"YE",name:"Yemen"},
    {code:"ZM",name:"Zambia"},
    {code:"ZW",name:"Zimbabwe"},

]

export const Languages = [
    {code:"en_US", lang:"en", name:"English (United States)"},
    {code:"ar", lang:"ar", name:"العربية"},
    {code:"ary", lang:"ar", name:"العربية المغربية"},
    {code:"az", lang:"az", name:"Azərbaycan dili"},
    {code:"azb", lang:"az", name:"گؤنئی آذربایجان"},
    {code:"bel", lang:"be", name:"Беларуская мова"},
    {code:"bg_BG", lang:"bg", name:"Български"},
    {code:"bn_BD", lang:"bn", name:"বাংলা"},
    {code:"bs_BA", lang:"bs", name:"Bosanski"},
    {code:"ca", lang:"ca", name:"Català"},
    {code:"ceb", lang:"ceb", name:"Cebuano"},
    {code:"cs_CZ", lang:"cs", name:"Čeština‎"},
    {code:"cy", lang:"cy", name:"Cymraeg"},
    {code:"da_DK", lang:"da", name:"Dansk"},
    {code:"de_CH_informal", lang:"de", name:"Deutsch (Schweiz, Du)"},
    {code:"de_CH", lang:"de", name:"Deutsch (Schweiz)"},
    {code:"de_DE", lang:"de", name:"Deutsch"},
    {code:"de_DE_formal", lang:"de", name:"Deutsch (Sie)"},
    {code:"el", lang:"el", name:"Ελληνικά"},
    {code:"en_GB", lang:"en", name:"English (UK)"},
    {code:"en_AU", lang:"en", name:"English (Australia)"},
    {code:"en_ZA", lang:"en", name:"English (South Africa)"},
    {code:"en_NZ", lang:"en", name:"English (New Zealand)"},
    {code:"en_CA", lang:"en", name:"English (Canada)"},
    {code:"eo", lang:"eo", name:"Esperanto"},
    {code:"es_CL", lang:"es", name:"Español de Chile"},
    {code:"es_MX", lang:"es", name:"Español de México"},
    {code:"es_GT", lang:"es", name:"Español de Guatemala"},
    {code:"es_AR", lang:"es", name:"Español de Argentina"},
    {code:"es_ES", lang:"es", name:"Español"},
    {code:"es_PE", lang:"es", name:"Español de Perú"},
    {code:"es_CO", lang:"es", name:"Español de Colombia"},
    {code:"es_VE", lang:"es", name:"Español de Venezuela"},
    {code:"et", lang:"et", name:"Eesti"},
    {code:"eu", lang:"eu", name:"Euskara"},
    {code:"fa_IR", lang:"fa", name:"فارسی"},
    {code:"fi", lang:"fi", name:"Suomi"},
    {code:"fr_FR", lang:"fr", name:"Français"},
    {code:"fr_CA", lang:"fr", name:"Français du Canada"},
    {code:"fr_BE", lang:"fr", name:"Français de Belgique"},
    {code:"gd", lang:"gd", name:"Gàidhlig"},
    {code:"gl_ES", lang:"gl", name:"Galego"},
    {code:"haz", lang:"haz", name:"هزاره گی"},
    {code:"he_IL", lang:"he", name:"עִבְרִית"},
    {code:"hi_IN", lang:"hi", name:"हिन्दी"},
    {code:"hr", lang:"hr", name:"Hrvatski"},
    {code:"hu_HU", lang:"hu", name:"Magyar"},
    {code:"hy", lang:"hy", name:"Հայերեն"},
    {code:"id_ID", lang:"id", name:"Bahasa Indonesia"},
    {code:"is_IS", lang:"is", name:"Íslenska"},
    {code:"it_IT", lang:"it", name:"Italiano"},
    {code:"ja", lang:"ja", name:"日本語"},
    {code:"ka_GE", lang:"ka", name:"ქართული"},
    {code:"ko_KR", lang:"ko", name:"한국어"},
    {code:"lt_LT", lang:"lt", name:"Lietuvių kalba"},
    {code:"mk_MK", lang:"mk", name:"Македонски јазик"},
    {code:"mr", lang:"mr", name:"मराठी"},
    {code:"ms_MY", lang:"ms", name:"Bahasa Melayu"},
    {code:"my_MM", lang:"my", name:"ဗမာစာ"},
    {code:"nb_NO", lang:"nb", name:"Norsk bokmål"},
    {code:"nl_NL", lang:"nl", name:"Nederlands"},
    {code:"nl_NL_formal", lang:"nl", name:"Nederlands (Formeel)"},
    {code:"nn_NO", lang:"nn", name:"Norsk nynorsk"},
    {code:"oci", lang:"oc", name:"Occitan"},
    {code:"pl_PL", lang:"pl", name:"Polski"},
    {code:"ps", lang:"ps", name:"پښتو"},
    {code:"pt_BR", lang:"pt", name:"Português do Brasil"},
    {code:"pt_PT", lang:"pt", name:"Português"},
    {code:"ro_RO", lang:"ro", name:"Română"},
    {code:"ru_RU", lang:"ru", name:"Русский"},
    {code:"sk_SK", lang:"sk", name:"Slovenčina"},
    {code:"sl_SI", lang:"sl", name:"Slovenščina"},
    {code:"sq", lang:"sq", name:"Shqip"},
    {code:"sr_RS", lang:"sr", name:"Српски језик"},
    {code:"sv_SE", lang:"sv", name:"Svenska"},
    {code:"th", lang:"th", name:"ไทย"},
    {code:"tl", lang:"tl", name:"Tagalog"},
    {code:"tr_TR", lang:"tr", name:"Türkçe"},
    {code:"ug_CN", lang:"ug", name:"Uyƣurqə"},
    {code:"uk", lang:"uk", name:"Українська"},
    {code:"vi", lang:"vi", name:"Tiếng Việt"},
    {code:"zh_CN", lang:"zh", name:"简体中文"},
    {code:"zh_TW", lang:"zh", name:"繁體中文"},
]

export const TimeZones = [
    
    //<optgroup label="Arctic">

    //"Africa",    
    {timezone:"Africa/Abidjan", name:"Abidjan"},
    {timezone:"Africa/Accra", name:"Accra"},
    {timezone:"Africa/Addis_Ababa", name:"Addis Ababa"},
    {timezone:"Africa/Algiers", name:"Algiers"},
    {timezone:"Africa/Asmara", name:"Asmara"},
    {timezone:"Africa/Bamako", name:"Bamako"},
    {timezone:"Africa/Bangui", name:"Bangui"},
    {timezone:"Africa/Banjul", name:"Banjul"},
    {timezone:"Africa/Bissau", name:"Bissau"},
    {timezone:"Africa/Blantyre", name:"Blantyre"},
    {timezone:"Africa/Brazzaville", name:"Brazzaville"},
    {timezone:"Africa/Bujumbura", name:"Bujumbura"},
    {timezone:"Africa/Cairo", name:"Cairo"},
    {timezone:"Africa/Casablanca", name:"Casablanca"},
    {timezone:"Africa/Ceuta", name:"Ceuta"},
    {timezone:"Africa/Conakry", name:"Conakry"},
    {timezone:"Africa/Dakar", name:"Dakar"},
    {timezone:"Africa/Dar_es_Salaam", name:"Dar es Salaam"},
    {timezone:"Africa/Djibouti", name:"Djibouti"},
    {timezone:"Africa/Douala", name:"Douala"},
    {timezone:"Africa/El_Aaiun", name:"El Aaiun"},
    {timezone:"Africa/Freetown", name:"Freetown"},
    {timezone:"Africa/Gaborone", name:"Gaborone"},
    {timezone:"Africa/Harare", name:"Harare"},
    {timezone:"Africa/Johannesburg", name:"Johannesburg"},
    {timezone:"Africa/Juba", name:"Juba"},
    {timezone:"Africa/Kampala", name:"Kampala"},
    {timezone:"Africa/Khartoum", name:"Khartoum"},
    {timezone:"Africa/Kigali", name:"Kigali"},
    {timezone:"Africa/Kinshasa", name:"Kinshasa"},
    {timezone:"Africa/Lagos", name:"Lagos"},
    {timezone:"Africa/Libreville", name:"Libreville"},
    {timezone:"Africa/Lome", name:"Lome"},
    {timezone:"Africa/Luanda", name:"Luanda"},
    {timezone:"Africa/Lubumbashi", name:"Lubumbashi"},
    {timezone:"Africa/Lusaka", name:"Lusaka"},
    {timezone:"Africa/Malabo", name:"Malabo"},
    {timezone:"Africa/Maputo", name:"Maputo"},
    {timezone:"Africa/Maseru", name:"Maseru"},
    {timezone:"Africa/Mbabane", name:"Mbabane"},
    {timezone:"Africa/Mogadishu", name:"Mogadishu"},
    {timezone:"Africa/Monrovia", name:"Monrovia"},
    {timezone:"Africa/Nairobi", name:"Nairobi"},
    {timezone:"Africa/Ndjamena", name:"Ndjamena"},
    {timezone:"Africa/Niamey", name:"Niamey"},
    {timezone:"Africa/Nouakchott", name:"Nouakchott"},
    {timezone:"Africa/Ouagadougou", name:"Ouagadougou"},
    {timezone:"Africa/Porto-Novo", name:"Porto-Novo"},
    {timezone:"Africa/Sao_Tome", name:"Sao Tome"},
    {timezone:"Africa/Tripoli", name:"Tripoli"},
    {timezone:"Africa/Tunis", name:"Tunis"},
    {timezone:"Africa/Windhoek", name:"Windhoek"},

    //"America",
    {timezone:"America/Adak", name:"Adak"},
    {timezone:"America/Anchorage", name:"Anchorage"},
    {timezone:"America/Anguilla", name:"Anguilla"},
    {timezone:"America/Antigua", name:"Antigua"},
    {timezone:"America/Araguaina", name:"Araguaina"},
    {timezone:"America/Argentina/Buenos_Aires", name:"Argentina - Buenos Aires"},
    {timezone:"America/Argentina/Catamarca", name:"Argentina - Catamarca"},
    {timezone:"America/Argentina/Cordoba", name:"Argentina - Cordoba"},
    {timezone:"America/Argentina/Jujuy", name:"Argentina - Jujuy"},
    {timezone:"America/Argentina/La_Rioja", name:"Argentina - La Rioja"},
    {timezone:"America/Argentina/Mendoza", name:"Argentina - Mendoza"},
    {timezone:"America/Argentina/Rio_Gallegos", name:"Argentina - Rio Gallegos"},
    {timezone:"America/Argentina/Salta", name:"Argentina - Salta"},
    {timezone:"America/Argentina/San_Juan", name:"Argentina - San Juan"},
    {timezone:"America/Argentina/San_Luis", name:"Argentina - San Luis"},
    {timezone:"America/Argentina/Tucuman", name:"Argentina - Tucuman"},
    {timezone:"America/Argentina/Ushuaia", name:"Argentina - Ushuaia"},
    {timezone:"America/Aruba", name:"Aruba"},
    {timezone:"America/Asuncion", name:"Asuncion"},
    {timezone:"America/Atikokan", name:"Atikokan"},
    {timezone:"America/Bahia", name:"Bahia"},
    {timezone:"America/Bahia_Banderas", name:"Bahia Banderas"},
    {timezone:"America/Barbados", name:"Barbados"},
    {timezone:"America/Belem", name:"Belem"},
    {timezone:"America/Belize", name:"Belize"},
    {timezone:"America/Blanc-Sablon", name:"Blanc-Sablon"},
    {timezone:"America/Boa_Vista", name:"Boa Vista"},
    {timezone:"America/Bogota", name:"Bogota"},
    {timezone:"America/Boise", name:"Boise"},
    {timezone:"America/Cambridge_Bay", name:"Cambridge Bay"},
    {timezone:"America/Campo_Grande", name:"Campo Grande"},
    {timezone:"America/Cancun", name:"Cancun"},
    {timezone:"America/Caracas", name:"Caracas"},
    {timezone:"America/Cayenne", name:"Cayenne"},
    {timezone:"America/Cayman", name:"Cayman"},
    {timezone:"America/Chicago", name:"Chicago"},
    {timezone:"America/Chihuahua", name:"Chihuahua"},
    {timezone:"America/Costa_Rica", name:"Costa Rica"},
    {timezone:"America/Creston", name:"Creston"},
    {timezone:"America/Cuiaba", name:"Cuiaba"},
    {timezone:"America/Curacao", name:"Curacao"},
    {timezone:"America/Danmarkshavn", name:"Danmarkshavn"},
    {timezone:"America/Dawson", name:"Dawson"},
    {timezone:"America/Dawson_Creek", name:"Dawson Creek"},
    {timezone:"America/Denver", name:"Denver"},
    {timezone:"America/Detroit", name:"Detroit"},
    {timezone:"America/Dominica", name:"Dominica"},
    {timezone:"America/Edmonton", name:"Edmonton"},
    {timezone:"America/Eirunepe", name:"Eirunepe"},
    {timezone:"America/El_Salvador", name:"El Salvador"},
    {timezone:"America/Fortaleza", name:"Fortaleza"},
    {timezone:"America/Glace_Bay", name:"Glace Bay"},
    {timezone:"America/Godthab", name:"Godthab"},
    {timezone:"America/Goose_Bay", name:"Goose Bay"},
    {timezone:"America/Grand_Turk", name:"Grand Turk"},
    {timezone:"America/Grenada", name:"Grenada"},
    {timezone:"America/Guadeloupe", name:"Guadeloupe"},
    {timezone:"America/Guatemala", name:"Guatemala"},
    {timezone:"America/Guayaquil", name:"Guayaquil"},
    {timezone:"America/Guyana", name:"Guyana"},
    {timezone:"America/Halifax", name:"Halifax"},
    {timezone:"America/Havana", name:"Havana"},
    {timezone:"America/Hermosillo", name:"Hermosillo"},
    {timezone:"America/Indiana/Indianapolis", name:"Indiana - Indianapolis"},
    {timezone:"America/Indiana/Knox", name:"Indiana - Knox"},
    {timezone:"America/Indiana/Marengo", name:"Indiana - Marengo"},
    {timezone:"America/Indiana/Petersburg", name:"Indiana - Petersburg"},
    {timezone:"America/Indiana/Tell_City", name:"Indiana - Tell City"},
    {timezone:"America/Indiana/Vevay", name:"Indiana - Vevay"},
    {timezone:"America/Indiana/Vincennes", name:"Indiana - Vincennes"},
    {timezone:"America/Indiana/Winamac", name:"Indiana - Winamac"},
    {timezone:"America/Inuvik", name:"Inuvik"},
    {timezone:"America/Iqaluit", name:"Iqaluit"},
    {timezone:"America/Jamaica", name:"Jamaica"},
    {timezone:"America/Juneau", name:"Juneau"},
    {timezone:"America/Kentucky/Louisville", name:"Kentucky - Louisville"},
    {timezone:"America/Kentucky/Monticello", name:"Kentucky - Monticello"},
    {timezone:"America/Kralendijk", name:"Kralendijk"},
    {timezone:"America/La_Paz", name:"La Paz"},
    {timezone:"America/Lima", name:"Lima"},
    {timezone:"America/Los_Angeles", name:"Los Angeles"},
    {timezone:"America/Lower_Princes", name:"Lower Princes"},
    {timezone:"America/Maceio", name:"Maceio"},
    {timezone:"America/Managua", name:"Managua"},
    {timezone:"America/Manaus", name:"Manaus"},
    {timezone:"America/Marigot", name:"Marigot"},
    {timezone:"America/Martinique", name:"Martinique"},
    {timezone:"America/Matamoros", name:"Matamoros"},
    {timezone:"America/Mazatlan", name:"Mazatlan"},
    {timezone:"America/Menominee", name:"Menominee"},
    {timezone:"America/Merida", name:"Merida"},
    {timezone:"America/Metlakatla", name:"Metlakatla"},
    {timezone:"America/Mexico_City", name:"Mexico City"},
    {timezone:"America/Miquelon", name:"Miquelon"},
    {timezone:"America/Moncton", name:"Moncton"},
    {timezone:"America/Monterrey", name:"Monterrey"},
    {timezone:"America/Montevideo", name:"Montevideo"},
    {timezone:"America/Montserrat", name:"Montserrat"},
    {timezone:"America/Nassau", name:"Nassau"},
    {timezone:"America/New_York", name:"New York"},
    {timezone:"America/Nipigon", name:"Nipigon"},
    {timezone:"America/Nome", name:"Nome"},
    {timezone:"America/Noronha", name:"Noronha"},
    {timezone:"America/North_Dakota/Beulah", name:"North Dakota - Beulah"},
    {timezone:"America/North_Dakota/Center", name:"North Dakota - Center"},
    {timezone:"America/North_Dakota/New_Salem", name:"North Dakota - New Salem"},
    {timezone:"America/Ojinaga", name:"Ojinaga"},
    {timezone:"America/Panama", name:"Panama"},
    {timezone:"America/Pangnirtung", name:"Pangnirtung"},
    {timezone:"America/Paramaribo", name:"Paramaribo"},
    {timezone:"America/Phoenix", name:"Phoenix"},
    {timezone:"America/Port-au-Prince", name:"Port-au-Prince"},
    {timezone:"America/Port_of_Spain", name:"Port of Spain"},
    {timezone:"America/Porto_Velho", name:"Porto Velho"},
    {timezone:"America/Puerto_Rico", name:"Puerto Rico"},
    {timezone:"America/Rainy_River", name:"Rainy River"},
    {timezone:"America/Rankin_Inlet", name:"Rankin Inlet"},
    {timezone:"America/Recife", name:"Recife"},
    {timezone:"America/Regina", name:"Regina"},
    {timezone:"America/Resolute", name:"Resolute"},
    {timezone:"America/Rio_Branco", name:"Rio Branco"},
    {timezone:"America/Santa_Isabel", name:"Santa Isabel"},
    {timezone:"America/Santarem", name:"Santarem"},
    {timezone:"America/Santiago", name:"Santiago"},
    {timezone:"America/Santo_Domingo", name:"Santo Domingo"},
    {timezone:"America/Sao_Paulo", name:"Sao Paulo"},
    {timezone:"America/Scoresbysund", name:"Scoresbysund"},
    {timezone:"America/Sitka", name:"Sitka"},
    {timezone:"America/St_Barthelemy", name:"St Barthelemy"},
    {timezone:"America/St_Johns", name:"St Johns"},
    {timezone:"America/St_Kitts", name:"St Kitts"},
    {timezone:"America/St_Lucia", name:"St Lucia"},
    {timezone:"America/St_Thomas", name:"St Thomas"},
    {timezone:"America/St_Vincent", name:"St Vincent"},
    {timezone:"America/Swift_Current", name:"Swift Current"},
    {timezone:"America/Tegucigalpa", name:"Tegucigalpa"},
    {timezone:"America/Thule", name:"Thule"},
    {timezone:"America/Thunder_Bay", name:"Thunder Bay"},
    {timezone:"America/Tijuana", name:"Tijuana"},
    {timezone:"America/Toronto", name:"Toronto"},
    {timezone:"America/Tortola", name:"Tortola"},
    {timezone:"America/Vancouver", name:"Vancouver"},
    {timezone:"America/Whitehorse", name:"Whitehorse"},
    {timezone:"America/Winnipeg", name:"Winnipeg"},
    {timezone:"America/Yakutat", name:"Yakutat"},
    {timezone:"America/Yellowknife", name:"Yellowknife"},

    //"Antarctica"]
    {timezone:"Antarctica/Casey", name:"Casey"},
    {timezone:"Antarctica/Davis", name:"Davis"},
    {timezone:"Antarctica/DumontDUrville", name:"DumontDUrville"},
    {timezone:"Antarctica/Macquarie", name:"Macquarie"},
    {timezone:"Antarctica/Mawson", name:"Mawson"},
    {timezone:"Antarctica/McMurdo", name:"McMurdo"},
    {timezone:"Antarctica/Palmer", name:"Palmer"},
    {timezone:"Antarctica/Rothera", name:"Rothera"},
    {timezone:"Antarctica/Syowa", name:"Syowa"},
    {timezone:"Antarctica/Troll", name:"Troll"},
    {timezone:"Antarctica/Vostok", name:"Vostok"},

    //"Arctic"
    {timezone:"Arctic/Longyearbyen", name:"Longyearbyen"},
    

    //"Asia"
    {timezone:"Asia/Aden", name:"Aden"},
    {timezone:"Asia/Almaty", name:"Almaty"},
    {timezone:"Asia/Amman", name:"Amman"},
    {timezone:"Asia/Anadyr", name:"Anadyr"},
    {timezone:"Asia/Aqtau", name:"Aqtau"},
    {timezone:"Asia/Aqtobe", name:"Aqtobe"},
    {timezone:"Asia/Ashgabat", name:"Ashgabat"},
    {timezone:"Asia/Baghdad", name:"Baghdad"},
    {timezone:"Asia/Bahrain", name:"Bahrain"},
    {timezone:"Asia/Baku", name:"Baku"},
    {timezone:"Asia/Bangkok", name:"Bangkok"},
    {timezone:"Asia/Beirut", name:"Beirut"},
    {timezone:"Asia/Bishkek", name:"Bishkek"},
    {timezone:"Asia/Brunei", name:"Brunei"},
    {timezone:"Asia/Chita", name:"Chita"},
    {timezone:"Asia/Choibalsan", name:"Choibalsan"},
    {timezone:"Asia/Colombo", name:"Colombo"},
    {timezone:"Asia/Damascus", name:"Damascus"},
    {timezone:"Asia/Dhaka", name:"Dhaka"},
    {timezone:"Asia/Dili", name:"Dili"},
    {timezone:"Asia/Dubai", name:"Dubai"},
    {timezone:"Asia/Dushanbe", name:"Dushanbe"},
    {timezone:"Asia/Gaza", name:"Gaza"},
    {timezone:"Asia/Hebron", name:"Hebron"},
    {timezone:"Asia/Ho_Chi_Minh", name:"Ho Chi Minh"},
    {timezone:"Asia/Hong_Kong", name:"Hong Kong"},
    {timezone:"Asia/Hovd", name:"Hovd"},
    {timezone:"Asia/Irkutsk", name:"Irkutsk"},
    {timezone:"Asia/Jakarta", name:"Jakarta"},
    {timezone:"Asia/Jayapura", name:"Jayapura"},
    {timezone:"Asia/Jerusalem", name:"Jerusalem"},
    {timezone:"Asia/Kabul", name:"Kabul"},
    {timezone:"Asia/Kamchatka", name:"Kamchatka"},
    {timezone:"Asia/Karachi", name:"Karachi"},
    {timezone:"Asia/Kathmandu", name:"Kathmandu"},
    {timezone:"Asia/Khandyga", name:"Khandyga"},
    {timezone:"Asia/Kolkata", name:"Kolkata"},
    {timezone:"Asia/Krasnoyarsk", name:"Krasnoyarsk"},
    {timezone:"Asia/Kuala_Lumpur", name:"Kuala Lumpur"},
    {timezone:"Asia/Kuching", name:"Kuching"},
    {timezone:"Asia/Kuwait", name:"Kuwait"},
    {timezone:"Asia/Macau", name:"Macau"},
    {timezone:"Asia/Magadan", name:"Magadan"},
    {timezone:"Asia/Makassar", name:"Makassar"},
    {timezone:"Asia/Manila", name:"Manila"},
    {timezone:"Asia/Muscat", name:"Muscat"},
    {timezone:"Asia/Nicosia", name:"Nicosia"},
    {timezone:"Asia/Novokuznetsk", name:"Novokuznetsk"},
    {timezone:"Asia/Novosibirsk", name:"Novosibirsk"},
    {timezone:"Asia/Omsk", name:"Omsk"},
    {timezone:"Asia/Oral", name:"Oral"},
    {timezone:"Asia/Phnom_Penh", name:"Phnom Penh"},
    {timezone:"Asia/Pontianak", name:"Pontianak"},
    {timezone:"Asia/Pyongyang", name:"Pyongyang"},
    {timezone:"Asia/Qatar", name:"Qatar"},
    {timezone:"Asia/Qyzylorda", name:"Qyzylorda"},
    {timezone:"Asia/Rangoon", name:"Rangoon"},
    {timezone:"Asia/Riyadh", name:"Riyadh"},
    {timezone:"Asia/Sakhalin", name:"Sakhalin"},
    {timezone:"Asia/Samarkand", name:"Samarkand"},
    {timezone:"Asia/Seoul", name:"Seoul"},
    {timezone:"Asia/Shanghai", name:"Shanghai"},
    {timezone:"Asia/Singapore", name:"Singapore"},
    {timezone:"Asia/Srednekolymsk", name:"Srednekolymsk"},
    {timezone:"Asia/Taipei", name:"Taipei"},
    {timezone:"Asia/Tashkent", name:"Tashkent"},
    {timezone:"Asia/Tbilisi", name:"Tbilisi"},
    {timezone:"Asia/Tehran", name:"Tehran"},
    {timezone:"Asia/Thimphu", name:"Thimphu"},
    {timezone:"Asia/Tokyo", name:"Tokyo"},
    {timezone:"Asia/Ulaanbaatar", name:"Ulaanbaatar"},
    {timezone:"Asia/Urumqi", name:"Urumqi"},
    {timezone:"Asia/Ust-Nera", name:"Ust-Nera"},
    {timezone:"Asia/Vientiane", name:"Vientiane"},
    {timezone:"Asia/Vladivostok", name:"Vladivostok"},
    {timezone:"Asia/Yakutsk", name:"Yakutsk"},
    {timezone:"Asia/Yekaterinburg", name:"Yekaterinburg"},
    {timezone:"Asia/Yerevan", name:"Yerevan"},

    //"Atlantic"
    {timezone:"Atlantic/Azores", name:"Azores"},
    {timezone:"Atlantic/Bermuda", name:"Bermuda"},
    {timezone:"Atlantic/Canary", name:"Canary"},
    {timezone:"Atlantic/Cape_Verde", name:"Cape Verde"},
    {timezone:"Atlantic/Faroe", name:"Faroe"},
    {timezone:"Atlantic/Madeira", name:"Madeira"},
    {timezone:"Atlantic/Reykjavik", name:"Reykjavik"},
    {timezone:"Atlantic/South_Georgia", name:"South Georgia"},
    {timezone:"Atlantic/Stanley", name:"Stanley"},
    {timezone:"Atlantic/St_Helena", name:"St Helena"},

    //"Australia"
    {timezone:"Australia/Adelaide", name:"Adelaide"},
    {timezone:"Australia/Brisbane", name:"Brisbane"},
    {timezone:"Australia/Broken_Hill", name:"Broken Hill"},
    {timezone:"Australia/Currie", name:"Currie"},
    {timezone:"Australia/Darwin", name:"Darwin"},
    {timezone:"Australia/Eucla", name:"Eucla"},
    {timezone:"Australia/Hobart", name:"Hobart"},
    {timezone:"Australia/Lindeman", name:"Lindeman"},
    {timezone:"Australia/Lord_Howe", name:"Lord Howe"},
    {timezone:"Australia/Melbourne", name:"Melbourne"},
    {timezone:"Australia/Perth", name:"Perth"},
    {timezone:"Australia/Sydney", name:"Sydney"},

    //"Europe"
    {timezone:"Europe/Amsterdam", name:"Amsterdam"},
    {timezone:"Europe/Andorra", name:"Andorra"},
    {timezone:"Europe/Athens", name:"Athens"},
    {timezone:"Europe/Belgrade", name:"Belgrade"},
    {timezone:"Europe/Berlin", name:"Berlin"},
    {timezone:"Europe/Bratislava", name:"Bratislava"},
    {timezone:"Europe/Brussels", name:"Brussels"},
    {timezone:"Europe/Bucharest", name:"Bucharest"},
    {timezone:"Europe/Budapest", name:"Budapest"},
    {timezone:"Europe/Busingen", name:"Busingen"},
    {timezone:"Europe/Chisinau", name:"Chisinau"},
    {timezone:"Europe/Copenhagen", name:"Copenhagen"},
    {timezone:"Europe/Dublin", name:"Dublin"},
    {timezone:"Europe/Gibraltar", name:"Gibraltar"},
    {timezone:"Europe/Guernsey", name:"Guernsey"},
    {timezone:"Europe/Helsinki", name:"Helsinki"},
    {timezone:"Europe/Isle_of_Man", name:"Isle of Man"},
    {timezone:"Europe/Istanbul", name:"Istanbul"},
    {timezone:"Europe/Jersey", name:"Jersey"},
    {timezone:"Europe/Kaliningrad", name:"Kaliningrad"},
    {timezone:"Europe/Kiev", name:"Kiev"},
    {timezone:"Europe/Lisbon", name:"Lisbon"},
    {timezone:"Europe/Ljubljana", name:"Ljubljana"},
    {timezone:"Europe/London", name:"London"},
    {timezone:"Europe/Luxembourg", name:"Luxembourg"},
    {timezone:"Europe/Madrid", name:"Madrid"},
    {timezone:"Europe/Malta", name:"Malta"},
    {timezone:"Europe/Mariehamn", name:"Mariehamn"},
    {timezone:"Europe/Minsk", name:"Minsk"},
    {timezone:"Europe/Monaco", name:"Monaco"},
    {timezone:"Europe/Moscow", name:"Moscow"},
    {timezone:"Europe/Oslo", name:"Oslo"},
    {timezone:"Europe/Paris", name:"Paris"},
    {timezone:"Europe/Podgorica", name:"Podgorica"},
    {timezone:"Europe/Prague", name:"Prague"},
    {timezone:"Europe/Riga", name:"Riga"},
    {timezone:"Europe/Rome", name:"Rome"},
    {timezone:"Europe/Samara", name:"Samara"},
    {timezone:"Europe/San_Marino", name:"San Marino"},
    {timezone:"Europe/Sarajevo", name:"Sarajevo"},
    {timezone:"Europe/Simferopol", name:"Simferopol"},
    {timezone:"Europe/Skopje", name:"Skopje"},
    {timezone:"Europe/Sofia", name:"Sofia"},
    {timezone:"Europe/Stockholm", name:"Stockholm"},
    {timezone:"Europe/Tallinn", name:"Tallinn"},
    {timezone:"Europe/Tirane", name:"Tirane"},
    {timezone:"Europe/Uzhgorod", name:"Uzhgorod"},
    {timezone:"Europe/Vaduz", name:"Vaduz"},
    {timezone:"Europe/Vatican", name:"Vatican"},
    {timezone:"Europe/Vienna", name:"Vienna"},
    {timezone:"Europe/Vilnius", name:"Vilnius"},
    {timezone:"Europe/Volgograd", name:"Volgograd"},
    {timezone:"Europe/Warsaw", name:"Warsaw"},
    {timezone:"Europe/Zagreb", name:"Zagreb"},
    {timezone:"Europe/Zaporozhye", name:"Zaporozhye"},
    {timezone:"Europe/Zurich", name:"Zurich"},

    //"Indian"
    {timezone:"Indian/Antananarivo", name:"Antananarivo"},
    {timezone:"Indian/Chagos", name:"Chagos"},
    {timezone:"Indian/Christmas", name:"Christmas"},
    {timezone:"Indian/Cocos", name:"Cocos"},
    {timezone:"Indian/Comoro", name:"Comoro"},
    {timezone:"Indian/Kerguelen", name:"Kerguelen"},
    {timezone:"Indian/Mahe", name:"Mahe"},
    {timezone:"Indian/Maldives", name:"Maldives"},
    {timezone:"Indian/Mauritius", name:"Mauritius"},
    {timezone:"Indian/Mayotte", name:"Mayotte"},
    {timezone:"Indian/Reunion", name:"Reunion"},

    //"Pacific"
    {timezone:"Pacific/Apia", name:"Apia"},
    {timezone:"Pacific/Auckland", name:"Auckland"},
    {timezone:"Pacific/Chatham", name:"Chatham"},
    {timezone:"Pacific/Chuuk", name:"Chuuk"},
    {timezone:"Pacific/Easter", name:"Easter"},
    {timezone:"Pacific/Efate", name:"Efate"},
    {timezone:"Pacific/Enderbury", name:"Enderbury"},
    {timezone:"Pacific/Fakaofo", name:"Fakaofo"},
    {timezone:"Pacific/Fiji", name:"Fiji"},
    {timezone:"Pacific/Funafuti", name:"Funafuti"},
    {timezone:"Pacific/Galapagos", name:"Galapagos"},
    {timezone:"Pacific/Gambier", name:"Gambier"},
    {timezone:"Pacific/Guadalcanal", name:"Guadalcanal"},
    {timezone:"Pacific/Guam", name:"Guam"},
    {timezone:"Pacific/Honolulu", name:"Honolulu"},
    {timezone:"Pacific/Johnston", name:"Johnston"},
    {timezone:"Pacific/Kiritimati", name:"Kiritimati"},
    {timezone:"Pacific/Kosrae", name:"Kosrae"},
    {timezone:"Pacific/Kwajalein", name:"Kwajalein"},
    {timezone:"Pacific/Majuro", name:"Majuro"},
    {timezone:"Pacific/Marquesas", name:"Marquesas"},
    {timezone:"Pacific/Midway", name:"Midway"},
    {timezone:"Pacific/Nauru", name:"Nauru"},
    {timezone:"Pacific/Niue", name:"Niue"},
    {timezone:"Pacific/Norfolk", name:"Norfolk"},
    {timezone:"Pacific/Noumea", name:"Noumea"},
    {timezone:"Pacific/Pago_Pago", name:"Pago Pago"},
    {timezone:"Pacific/Palau", name:"Palau"},
    {timezone:"Pacific/Pitcairn", name:"Pitcairn"},
    {timezone:"Pacific/Pohnpei", name:"Pohnpei"},
    {timezone:"Pacific/Port_Moresby", name:"Port Moresby"},
    {timezone:"Pacific/Rarotonga", name:"Rarotonga"},
    {timezone:"Pacific/Saipan", name:"Saipan"},
    {timezone:"Pacific/Tahiti", name:"Tahiti"},
    {timezone:"Pacific/Tarawa", name:"Tarawa"},
    {timezone:"Pacific/Tongatapu", name:"Tongatapu"},
    {timezone:"Pacific/Wake", name:"Wake"},
    {timezone:"Pacific/Wallis", name:"Wallis"},

    //"UTC"
    {timezone:"UTC", name:"UTC"},

    //"Manual Offsets"
    {timezone:"UTC-12", name:"UTC-12"},
    {timezone:"UTC-11.5", name:"UTC-11:30"},
    {timezone:"UTC-11", name:"UTC-11"},
    {timezone:"UTC-10.5", name:"UTC-10:30"},
    {timezone:"UTC-10", name:"UTC-10"},
    {timezone:"UTC-9.5", name:"UTC-9:30"},
    {timezone:"UTC-9", name:"UTC-9"},
    {timezone:"UTC-8.5", name:"UTC-8:30"},
    {timezone:"UTC-8", name:"UTC-8"},
    {timezone:"UTC-7.5", name:"UTC-7:30"},
    {timezone:"UTC-7", name:"UTC-7"},
    {timezone:"UTC-6.5", name:"UTC-6:30"},
    {timezone:"UTC-6", name:"UTC-6"},
    {timezone:"UTC-5.5", name:"UTC-5:30"},
    {timezone:"UTC-5", name:"UTC-5"},
    {timezone:"UTC-4.5", name:"UTC-4:30"},
    {timezone:"UTC-4", name:"UTC-4"},
    {timezone:"UTC-3.5", name:"UTC-3:30"},
    {timezone:"UTC-3", name:"UTC-3"},
    {timezone:"UTC-2.5", name:"UTC-2:30"},
    {timezone:"UTC-2", name:"UTC-2"},
    {timezone:"UTC-1.5", name:"UTC-1:30"},
    {timezone:"UTC-1", name:"UTC-1"},
    {timezone:"UTC-0.5", name:"UTC-0:30"},
    {timezone:"UTC+0", name:"UTC+0"},
    {timezone:"UTC+0.5", name:"UTC+0:30"},
    {timezone:"UTC+1", name:"UTC+1"},
    {timezone:"UTC+1.5", name:"UTC+1:30"},
    {timezone:"UTC+2", name:"UTC+2"},
    {timezone:"UTC+2.5", name:"UTC+2:30"},
    {timezone:"UTC+3", name:"UTC+3"},
    {timezone:"UTC+3.5", name:"UTC+3:30"},
    {timezone:"UTC+4", name:"UTC+4"},
    {timezone:"UTC+4.5", name:"UTC+4:30"},
    {timezone:"UTC+5", name:"UTC+5"},
    {timezone:"UTC+5.5", name:"UTC+5:30"},
    {timezone:"UTC+5.75", name:"UTC+5:45"},
    {timezone:"UTC+6", name:"UTC+6"},
    {timezone:"UTC+6.5", name:"UTC+6:30"},
    {timezone:"UTC+7", name:"UTC+7"},
    {timezone:"UTC+7.5", name:"UTC+7:30"},
    {timezone:"UTC+8", name:"UTC+8"},
    {timezone:"UTC+8.5", name:"UTC+8:30"},
    {timezone:"UTC+8.75", name:"UTC+8:45"},
    {timezone:"UTC+9", name:"UTC+9"},
    {timezone:"UTC+9.5", name:"UTC+9:30"},
    {timezone:"UTC+10", name:"UTC+10"},
    {timezone:"UTC+10.5", name:"UTC+10:30"},
    {timezone:"UTC+11", name:"UTC+11"},
    {timezone:"UTC+11.5", name:"UTC+11:30"},
    {timezone:"UTC+12", name:"UTC+12"},
    {timezone:"UTC+12.75", name:"UTC+12:45"},
    {timezone:"UTC+13", name:"UTC+13"},
    {timezone:"UTC+13.75", name:"UTC+13:45"},
    {timezone:"UTC+14", name:"UTC+14"},
]

export const Postes = [
    {name:"Secretaire", code:"ST"},
    {name:"Caissier", code:"CS"},
    {name:"Medecin", code:"DR"},
    {name:"Infirmier", code:"NS"},
    {name:"Laborantin", code:"LB"},
    {name:"Plateau Technique", code:"PT"},
    {name:"Pharmacien", code:"PH"} // Ajout du poste Pharmacien
]
export const Services = [
    {name:"Urgence", code:"OP"},
    {name:"Pediatrie", code:"CS"},
    {name:"Laboratoire", code:"DR"}, // Ce code DR est aussi utilisé pour Medecin dans Postes, attention aux conflits si utilisés ensemble.
    {name:"Psychiatrie", code:"NS"}, // Ce code NS est aussi utilisé pour Infirmier
    {name:"Plateau Technique", code:"PT"},
    {name:"consultation", code:"CO"},
    {name:"Pharmacie", code:"PH"}, // Ajout service Pharmacie
    {name:"Caisse", code:"CA"}, // Ajout service Caisse
]

export const PatientStatus = [
    'Interned', 'Externed'
]

export const BillStatus = [
    'Paid', 'Unpaid'
]

export const SAMPLE_DATA = {
    PATIENT : [],
    DOCTOR_1 : [
        {id:"ws1", value:"Wotonwo", label:"Wotonwo", speciality:"surgery"},
        {id:"td1", value:"Tchounkeu", label:"Tchounkeu", speciality:"dentist"},
        {id:"rp1", value:"Randy", label:"Randy", speciality:"pediatry"},
    ],
    DOCTOR_2 : [
        { key:"ws1", value:"Wotonwo", label:"Wotonwo" },
        { key:"td1", value:"Tchounkeu", label:"Tchounkeu" },
        { key:"rp1", value:"Randy", label:"Randy" },
    ],
}

export const DataListOf = (entry, id=null) => {

    const [datas, setDatas] = useState([]);
    const [loading, setLoading] = useState(true); // Ajout état de chargement
    const [error, setError] = useState(null); // Ajout état d'erreur
    let entry_link;

    // Utilisation d'un useEffect pour reconstruire entry_link seulement si 'entry' ou 'id' change.
    useEffect(() => {
        switch(entry){
            case 'patient_all': // Plus spécifique pour éviter confusion
                entry_link = wServer.GET.PATIENT.ALL;
                break;
            case 'patient_profile_v2': // Utilisation de la nouvelle route GET
                if (id) entry_link = wServer.GET.PATIENT.PROFILE_BY_MATRICULE_V2(id);
                else {
                    console.warn("DataListOf: ID manquant pour patient_profile_v2");
                    setLoading(false);
                    return;
                }
                break;
            case 'doctor_all':
                entry_link = wServer.GET.DOCTORS;
                break;
            case 'logged_in_user':
                entry_link = wServer.GET.LOGGED_IN;
                break;
            case 'patient':
                entry_link = wServer.GET.PATIENT.ALL
                break;
            case 'doctor':
                entry_link = wServer.GET.DOCTORS
                break;
            case 'login':
                entry_link = wServer.GET.LOGGED_IN
                break;
            default:
                console.warn(`DataListOf: Type d'entrée non reconnu ou ID manquant - ${entry}`);
                entry_link = wServer.GET.PATIENT.ALL
                break;
                                
        }

        if (id!==null) entry_link = entry_link + id;

        if (!entry_link) { // Si entry_link n'est pas défini après le switch
            setLoading(false);
            return;
        }

        const loadDatas = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(entry_link, {
                    method: 'GET', // Explicite, même si c'est le défaut
                    redirect: 'follow',
                    headers: {
                        'Authorization': `Token ${localStorage.getItem("_compuclinicToken")}`,
                        'Content-Type': 'application/json' // Bonne pratique
                    }
                });

                if (!response.ok) { // Gestion des erreurs HTTP
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setDatas(result);
            } catch (err) {
                console.error('Error in DataListOf hook:', err);
                setError(err.message);
                setDatas([]); // Vider les données en cas d'erreur
            } finally {
                setLoading(false);
            }
        };
  
        loadDatas();
    }, [entry, id]); // Dépendances correctes pour useEffect
    
    return {datas, loading, error}; // Retourner aussi loading et error
}
// --- END OF FILE Consts.js (Updated) ---

