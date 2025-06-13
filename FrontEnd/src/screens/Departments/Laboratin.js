// --- START OF FILE Laboratin.js (Version avec onglet Pharmacie) ---
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Tabs, Tab, Box, Typography, Paper, Grid, CircularProgress } from "@mui/material";
import PageHeader from "../../components/PageHeader";
import { wapp, wServer } from "../../Data/Consts"; // Assurez-vous que ce chemin est correct
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
import axios from 'axios';

// Importer les composants existants
import LabDashboardWidgets from '../../components/Laborantin/LabDashboardWidgets';
import TableTypesExamensLab from '../../components/Laborantin/TableTypesExamensLab';
import TablePrescriptionsLab from '../../components/Laborantin/TablePrescriptionLab';

// Importer le nouveau composant pharmacie
import PharmacyViewForLab from '../../components/Laborantin/PharmacyViewForLab';

// Hook pour les statistiques (placeholder pour l'instant, on se concentre sur les types d'examens)
const useGetLabStats = () => {
  return useQuery('labStats', async () => {
    // Simule un appel API pour l'instant ou utilisez votre vraie route si prête
    // const { data } = await axios.get(wServer.GET.LABORANTIN.STATISTIQUES);
    // return data;
    await new Promise(resolve => setTimeout(resolve, 500)); // Simuler un délai
    return { statistiques: [], examensParCategorie: [] }; // Données vides pour l'instant
  }, { staleTime: 5 * 60 * 1000 });
};

const LaboratinPageContent = () => {
  const [activeTab, setActiveTab] = useState(0);
  // const { data: labStats, isLoading: isLoadingStats, isError: isErrorStats } = useGetLabStats(); // On commentera pour l'instant

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
      <div style={{ flex: 1 }} onClick={() => { document.body.classList.remove("offcanvas-active"); }}>
        <div className="container-fluid">
          <PageHeader
              HeaderText="Laboratoire d'Analyses Médicales"
              Breadcrumb={[
                { name: "Départements", navigate: wapp.DEPARTMENT.ALL },
                { name: "Laboratoire", navigate: wapp.DEPARTMENT.LABORANTIN },
              ]}
          />

          <Box sx={{ width: '100%', typography: 'body1' }}>
            <Paper elevation={1} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  aria-label="Onglets du laboratoire"
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="none"
              >
                <Tab label="Gestion des Types d'Examens" id="lab-tab-0" aria-controls="lab-tabpanel-0" />
                <Tab label="Prescriptions à Traiter" id="lab-tab-1" aria-controls="lab-tabpanel-1" />
                <Tab label="Consultation Pharmacie" id="lab-tab-2" aria-controls="lab-tabpanel-2" />
                {/* <Tab label="Tableau de Bord" id="lab-tab-3" aria-controls="lab-tabpanel-3" /> Onglet Dashboard si séparé */}
              </Tabs>
            </Paper>

            <TabPanel value={activeTab} index={0}>
              <Paper elevation={0} sx={{ p: 0 }}> {/* p:0 si TableTypesExamensLab a son propre padding */}
                {/* <Typography variant="h5" gutterBottom sx={{mb:2}}>Gestion des Types d'Examens Disponibles</Typography> */}
                <TableTypesExamensLab />
              </Paper>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <Paper elevation={0} sx={{ p: 0 }}>
                {/* <Typography variant="h5" gutterBottom sx={{mb:2}}>Prescriptions d'Examens en Attente de Traitement</Typography> */}
                <TablePrescriptionsLab />
              </Paper>
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              <Paper elevation={0} sx={{ p: 0 }}>
                <PharmacyViewForLab />
              </Paper>
            </TabPanel>

            {/* <TabPanel value={activeTab} index={3}>
            {isLoadingStats && <CircularProgress />}
            {isErrorStats && <Typography color="error">Erreur chargement statistiques.</Typography>}
            {labStats && <LabDashboardWidgets stats={labStats} />}
          </TabPanel> */}
          </Box>
        </div>
      </div>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`lab-tabpanel-${index}`}
          aria-labelledby={`lab-tab-${index}`}
          {...other}
      >
        {value === index && (
            <Box sx={{ pt: 2 }}> {/* Ajout d'un peu de padding top */}
              {children}
            </Box>
        )}
      </div>
  );
}

class Laboratin extends React.Component {
  render() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
          <LaboratinPageContent />
        </QueryClientProvider>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({});
export default connect(mapStateToProps, {})(Laboratin);
// --- END OF FILE Laboratin.js (Version avec onglet Pharmacie) ---
