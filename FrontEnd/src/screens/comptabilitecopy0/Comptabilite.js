import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import Comptabilite from "../../components/Forms/BasicValidationComptabilite";
import { wapp } from "../../Data/Consts";
// import AdvancedValidation from "../../components/Forms/AdvancedValidation";
import SecretaryImg from "../../assets/images/hospital-receptionist.png";
import CaisseImg from "../../assets/images/cashier.jpg";
import InfirmerieImg from "../../assets/images/nurse-man.jpg";
import MedecineImg from "../../assets/images/auth_bg1.jpeg";
import PlateauTechniqueImg from "../../assets/images/hospital-infrastructure.jpeg";
import LaborantinImg from "../../assets/images/image-gallery/1.jpg";
import GrhImg from "../../assets/images/hospital-grh.jpg";

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
              <Comptabilite title="Secretariat" role="Secretaire" image={SecretaryImg} link={wapp.COMPTABILITE.SECRETARY} />
              <Comptabilite title="Caisse" role="Caissier" image={CaisseImg} link={wapp.COMPTABILITE.CAISSE} />
              <Comptabilite title="Infirmerie" role="Infirmier" image={InfirmerieImg} link={wapp.COMPTABILITE.INFIRMERIE} />
              <Comptabilite title="Medecine" role="Docteur" image={MedecineImg} link={wapp.COMPTABILITE.MEDECINE} />
              <Comptabilite title="Plateau Technique" role="Technicien" image={PlateauTechniqueImg} link={wapp.COMPTABILITE.PLATEAU_TECHNIQUE} />
              <Comptabilite title="Laboratoire" role="Laborantin" image={LaborantinImg} link={wapp.COMPTABILITE.LABORANTIN} />
              <Comptabilite title="Ressources Humaines" role="RH" image={GrhImg} link={wapp.COMPTABILITE.GRH} />
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
