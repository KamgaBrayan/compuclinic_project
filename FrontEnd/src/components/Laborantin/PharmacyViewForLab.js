import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Tabs,
    Tab,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Chip,
    Alert,
    CircularProgress,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Container,
    Divider
} from '@mui/material';
import {
    Search as SearchIcon,
    Visibility as VisibilityIcon,
    Warning as WarningIcon,
    LocalPharmacy as PharmacyIcon
} from '@mui/icons-material';
import axios from 'axios';
import { wServer } from '../../Data/Consts';
import "./PharmacyViewForLab.css"

// Composant pour afficher les dosages par âge
const DosageInfo = ({ dosages }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {dosages && dosages.map((dosage, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                        label={`${dosage.fromAge} - ${dosage.toAge} ans`}
                        color="info"
                        size="small"
                    />
                    <Typography variant="body2" fontWeight="medium">
                        {dosage.dose} mg
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

// Modal de détails du médicament (version lecture seule)
const DrugDetailsModal = ({ drug, open, onClose }) => {
    const [dosages, setDosages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDosages = async () => {
            if (drug && open) {
                try {
                    setLoading(true);
                    setError(null);
                    console.log('Fetching dosages for drug:', drug.id);
                    const response = await axios.get(wServer.GET.LABORANTIN.PHARMACIE.DRUG_DOSAGES(drug.id));
                    console.log('Dosages response:', response.data);
                    setDosages(Array.isArray(response.data) ? response.data : []);
                } catch (error) {
                    console.error('Error fetching dosages:', error);
                    setError('Erreur lors du chargement des dosages');
                    setDosages([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (open) {
            fetchDosages();
        }
    }, [drug, open]);

    if (!drug) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PharmacyIcon color="primary" />
                    <Typography variant="h6">{drug.name}</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={drug.photoUrl || '/assets/images/default-medicine.jpg'}
                            alt={drug.name}
                            sx={{ borderRadius: 2, objectFit: 'cover' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {/* Informations générales */}
                            <Paper elevation={1} sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Informations générales
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Nom générique
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {drug.genericName}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Laboratoire
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {drug.laboratory}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Prix unitaire
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium" color="success.main">
                                            {drug.unitPrice} FCFA
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* Gestion du stock */}
                            <Paper elevation={1} sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Gestion du stock
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
                                            <Typography variant="h4" color="info.dark">
                                                {drug.stock}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                unités en stock
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
                                            <Typography variant="h4" color="warning.dark">
                                                {drug.minStockThreshold}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                seuil minimum
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                                {drug.stock <= drug.minStockThreshold && (
                                    <Alert severity="warning" icon={<WarningIcon />} sx={{ mt: 2 }}>
                                        Stock faible ! Contacter la pharmacie.
                                    </Alert>
                                )}
                            </Paper>

                            {/* Administration */}
                            <Paper elevation={1} sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Administration
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip label={drug.dosageForm} color="primary" />
                                    <Chip label={drug.administrationMethod} color="secondary" />
                                    <Chip label={drug.storageCondition} color="info" />
                                </Box>
                            </Paper>

                            {/* Dosage par âge */}
                            <Paper elevation={1} sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Dosage par âge
                                </Typography>
                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                        <CircularProgress size={24} />
                                    </Box>
                                ) : error ? (
                                    <Alert severity="error">{error}</Alert>
                                ) : dosages.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary">
                                        Aucun dosage défini
                                    </Typography>
                                ) : (
                                    <DosageInfo dosages={dosages} />
                                )}
                            </Paper>

                            {/* Composition */}
                            {drug.composition && (
                                <Paper elevation={1} sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom color="primary">
                                        Composition
                                    </Typography>
                                    <Typography variant="body2">{drug.composition}</Typography>
                                </Paper>
                            )}

                            {/* Commentaire */}
                            {drug.comment && (
                                <Paper elevation={1} sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom color="primary">
                                        Commentaire
                                    </Typography>
                                    <Typography variant="body2">{drug.comment}</Typography>
                                </Paper>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Alert severity="info" sx={{ flexGrow: 1, mr: 2 }}>
                    <strong>Note :</strong> Cette vue est en lecture seule. Pour toute demande de médicament, contactez la pharmacie.
                </Alert>
                <Button onClick={onClose} variant="contained">
                    Fermer
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Carte de médicament simplifiée (lecture seule)
const DrugCard = ({ drug, onViewDetails }) => {
    return (
        <Card
            sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                },
                borderLeft: 4,
                borderLeftColor: 'info.main'
            }}
            onClick={onViewDetails}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="140"
                    image={drug.photoUrl || 'https://www.universityofcalifornia.edu/sites/default/files/generic-drugs-istock.jpg'}
                    alt={drug.name}
                />
                {drug.stock <= drug.minStockThreshold && (
                    <Chip
                        label="Stock faible"
                        color="warning"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8
                        }}
                    />
                )}
            </Box>
            <CardContent>
                <Typography gutterBottom variant="h6" component="h3">
                    {drug.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {drug.genericName}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            Stock
                        </Typography>
                        <Typography variant="h6" color="info.main">
                            {drug.stock}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            Prix
                        </Typography>
                        <Typography variant="h6" color="success.main">
                            {drug.unitPrice} FCFA
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    <Chip label={drug.dosageForm} size="small" color="primary" />
                    <Chip label={drug.administrationMethod} size="small" color="info" />
                </Box>
            </CardContent>
        </Card>
    );
};

const PharmacyViewForLab = () => {
    const [drugs, setDrugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDrug, setSelectedDrug] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(0);
    const [activeSubCategory, setActiveSubCategory] = useState('');
    const [error, setError] = useState(null);

    const categories = ['Forme', 'Administration', 'Laboratoire'];
    const dosageForms = ['tablet', 'capsule', 'syrup', 'injectable'];
    const administrationMethods = ['cutaneous', 'ocular', 'auricular'];

    const fetchDrugs = async (query = '') => {
        try {
            setLoading(true);
            setError(null);
            const url = query
                ? `${wServer.GET.LABORANTIN.PHARMACIE.SEARCH_DRUGS}?field=name&query=${encodeURIComponent(query)}`
                : wServer.GET.LABORANTIN.PHARMACIE.ALL_DRUGS;

            console.log('Fetching drugs from:', url);
            const response = await axios.get(url);
            console.log('API Response:', response.data);

            const drugsData = Array.isArray(response.data) ? response.data :
                response.data.drugs ? response.data.drugs : [];

            setDrugs(drugsData);
        } catch (err) {
            console.error('Error fetching drugs:', err);
            setError('Erreur lors du chargement des médicaments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrugs();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            await fetchDrugs();
            return;
        }
        await fetchDrugs(searchQuery.trim());
    };

    const getSubCategories = () => {
        if (!Array.isArray(drugs)) return [];

        switch (activeCategory) {
            case 0: // Forme
                return dosageForms;
            case 1: // Administration
                return administrationMethods;
            case 2: // Laboratoire
                return [...new Set(drugs
                    .map(drug => drug.laboratory)
                    .filter(lab => lab != null && lab !== '')
                )];
            default:
                return [];
        }
    };

    const filterDrugs = () => {
        if (!Array.isArray(drugs)) return [];

        let filtered = [...drugs];

        if (activeSubCategory) {
            filtered = filtered.filter(drug => {
                switch (activeCategory) {
                    case 0: // Forme
                        return drug.dosageForm === activeSubCategory;
                    case 1: // Administration
                        return drug.administrationMethod === activeSubCategory;
                    case 2: // Laboratoire
                        return drug.laboratory === activeSubCategory;
                    default:
                        return true;
                }
            });
        }

        return filtered;
    };

    const filteredDrugs = filterDrugs();

    return (
        <Container maxWidth="xl" sx={{ py: 2 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PharmacyIcon color="primary" />
                    Consultation Pharmacie
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Vue en lecture seule pour vérifier la disponibilité des médicaments
                </Typography>
            </Box>

            {/* Search and Navigation */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <Tabs
                        value={activeCategory}
                        onChange={(e, newValue) => {
                            setActiveCategory(newValue);
                            setActiveSubCategory('');
                        }}
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        {categories.map((category, index) => (
                            <Tab key={index} label={category} />
                        ))}
                    </Tabs>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box component="form" onSubmit={handleSearch}>
                        <TextField
                            fullWidth
                            placeholder="Rechercher un médicament..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton type="submit">
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Sidebar */}
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            {categories[activeCategory]}
                        </Typography>
                        <List>
                            {getSubCategories().map((subCat) => (
                                <ListItem key={subCat} disablePadding>
                                    <ListItemButton
                                        selected={activeSubCategory === subCat}
                                        onClick={() => setActiveSubCategory(subCat)}
                                    >
                                        <ListItemText
                                            primary={subCat}
                                            sx={{ textTransform: 'capitalize' }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Main Content */}
                <Grid item xs={12} md={9}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredDrugs.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                Aucun médicament trouvé
                                {activeSubCategory && ` pour ${categories[activeCategory].toLowerCase()}: ${activeSubCategory}`}
                            </Typography>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredDrugs.map((drug) => (
                                <Grid item xs={12} sm={6} lg={4} key={drug.id}>
                                    <DrugCard
                                        drug={drug}
                                        onViewDetails={() => {
                                            setSelectedDrug(drug);
                                            setModalOpen(true);
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Grid>
            </Grid>

            {/* Modal */}
            <DrugDetailsModal
                drug={selectedDrug}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </Container>
    );
};

export default PharmacyViewForLab;