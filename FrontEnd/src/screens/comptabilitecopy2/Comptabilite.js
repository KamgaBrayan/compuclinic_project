import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import Comptabilite from "../../components/Forms/BasicValidationComptabilite";
import { wapp } from "../../Data/Consts";
// import AdvancedValidation from "../../components/Forms/AdvancedValidation";
import SecretaryImg from "../../assets/images/comptabilite/cim1.jpg";             
import CaisseImg from "../../assets/images/comptabilite/cim2.jpg";            
import InfirmerieImg from "../../assets/images/comptabilite/ciminves.jpeg";            
import MedecineImg from "../../assets/images/comptabilite/cimpha.jpg";            
import PlateauTechniqueImg from "../../assets/images/comptabilite/cimpha2.jpg";            
        

class Comptabilites extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    return (
      <div
        style={{ flex: 1 }}
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="All Comptabilite"
              Breadcrumb={[
                { name: "All", navigate: "" },
                { name: "Comptabilite", navigate: "" },
              ]}
            />
            <div className="row clearfix">
              <Comptabilite title="Investissement" role="." image={SecretaryImg} link={wapp.COMPTABILITE.SECRETARY} />
              <Comptabilite title="Dons" role="." image={CaisseImg} link={wapp.COMPTABILITE.CAISSE} />
              <Comptabilite title="Consultation" role="Docteur" image={MedecineImg} link={wapp.COMPTABILITE.MEDECINE} />
              <Comptabilite title="Pharmacie" role="Pharmacien" image={PlateauTechniqueImg} link={wapp.COMPTABILITE.PLATEAU_TECHNIQUE} />
            </div>
            {/*<div className="row clearfix">
              <AdvancedValidation />
            </div>*/}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({});

export default connect(mapStateToProps, {})(Comptabilites);
