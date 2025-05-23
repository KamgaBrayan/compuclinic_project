import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import ajouterPatient from "./ajouterPatient";
import { InternedPatientTableData, PatientTableData, PresentPatientTableData } from "../../dataComponents/SecretaryDataComponent";
import { wapp } from "../../Data/Consts";
import { CardModalHeader, ValidationModal } from "../../dataComponents/utils";
import { CreatePatientFormModal, EditPatientFormModal } from "../Patients/CreatePatientModal";
import { CreatePatientFormModalSecretaire, EditPatientFormModalSecretaire } from "../Patients/CreatePatientModalSecretaire";
import { TablePatientSecretaire } from "../Patients/TablePatientSecretaire";
import { TableConsultationSecretaire } from "../Patients/TableConsultationSecretaire";
// import BasicElementExample from "../../components/Forms/BasicElementExample";
// import DifferentSizing from "../../components/Forms/DifferentSizing";
// import InputwithCheckbox from "../../components/Forms/InputwithCheckbox";
// import MultipleAddons from "../../components/Forms/MultipleAddons";
// import CustomCheckboxes from "../../components/Forms/CustomCheckboxes";
// import InputButtonAddons from "../../components/Forms/InputButtonAddons";
// import CustomForms from "../../components/Forms/CustomForms";

class Secretaire extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  onTabChange = (e) => {
    var tab1 = document.getElementById("bacicTab3-1");
    tab1.classList.remove("active");
    tab1.children[0].classList.remove("active");
    var tab2 = document.getElementById("bacicTab3-2");
    tab2.classList.remove("active");
    tab2.children[0].classList.remove("active");
    var actab = document.getElementById("bacicTab3-" + e);
    actab.classList.add("active");
    actab.children[0].classList.add("active");

    var tabpan1 = document.getElementById("bacicTab3pan-1");
    tabpan1.classList.remove("active");
    var tabpan2 = document.getElementById("bacicTab3pan-2");
    tabpan2.classList.remove("active");
    var actabpab = document.getElementById("bacicTab3pan-" + e);
    actabpab.classList.add("active");
  };

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
              HeaderText="Secretary"
              Breadcrumb={[
                { name: "Department", navigate: `${wapp.DEPARTMENT.ALL}` },
                { name: "Secretaire", navigate: `${wapp.DEPARTMENT.SECRETARY}` },
              ]}
            />
            <div className="col-lg-12 col-md-12">
                  <div className="card">
                    <CreatePatientFormModal />   {/* ceci est le modal qui s'affiche apres avoir cliquer sur Add patient   */}
                    <EditPatientFormModal />
                    <EditPatientFormModalSecretaire />
                    <CreatePatientFormModalSecretaire /> 
                    <ValidationModal />
                    <div className="body">
                      
                      <ul className="nav nav-tabs-new2" role="tablist">
                        <li
                          className="nav-item mr-1 active"
                          id="bacicTab3-1"
                          role="presentation"
                          onClick={() => {
                            this.onTabChange(1);
                          }}
                        >
                          <a className="nav-link active">Patient</a>
                        </li>
                        <li
                          className="nav-item mr-1"
                          id="bacicTab3-2"
                          role="presentation"
                          onClick={() => {
                            this.onTabChange(2);
                          }}
                        >
                          <a className="nav-link">Consultation</a>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div className="tab-pane vivify fadeIn active" id="bacicTab3pan-1">
                          <TablePatientSecretaire />
                        </div>
                        <div className="tab-pane vivify fadeIn" id="bacicTab3pan-2">
                          <TableConsultationSecretaire />
                        </div>
                      </div>
                    </div>
                  </div>
            </div>
            {/*<div className="row clearfix">
              <div className="col-lg-6 col-md-12">
                
                <DifferentSizing />
                <InputwithCheckbox />
                <MultipleAddons />
                <CustomCheckboxes />
              </div>
              <div className="col-lg-6 col-md-12">
                <InputButtonAddons />
                <CustomForms />
              </div>
            </div>*/}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({});

export default connect(mapStateToProps, {})(Secretaire);
