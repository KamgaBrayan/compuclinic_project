import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { Dropdown } from "react-bootstrap";
import ajouterPatient from "./ajouterPatient";
import { InternedPatientTableData, PatientTableData, PresentPatientTableData } from "../../dataComponents/SecretaryDataComponent";
import { wapp } from "../../Data/Consts";
import { CardModalHeader, ValidationModal } from "../../dataComponents/utils";
import { TablePatientInfirmier } from "../Patients/TablePatientInfirmier";
import { TablePatientInfirmierTraite } from "../Patients/TablePatientInfirmierTraite";

class Infirmier extends React.Component {
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
    var tab3 = document.getElementById("bacicTab3-3");
    tab3.classList.remove("active");
    tab3.children[0].classList.remove("active");
    var actab = document.getElementById("bacicTab3-" + e);
    actab.classList.add("active");
    actab.children[0].classList.add("active");

    var tabpan1 = document.getElementById("bacicTab3pan-1");
    tabpan1.classList.remove("active");
    var tabpan2 = document.getElementById("bacicTab3pan-2");
    tabpan2.classList.remove("active");
    var tabpan3 = document.getElementById("bacicTab3pan-3");
    tabpan3.classList.remove("active");
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
              HeaderText="Nurse"
              Breadcrumb={[
                { name: "Department", navigate: `${wapp.DEPARTMENT.ALL}` },
                { name: "Infirmier", navigate: `${wapp.DEPARTMENT.INFIRMERIE}` },
              ]}
            />
            <div className="col-lg-12 col-md-12">
                  <div className="card">
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
                          <a className="nav-link active">Untreated Patients</a>
                        </li>
                        <li
                          className="nav-item mr-1"
                          id="bacicTab3-2"
                          role="presentation"
                          onClick={() => {
                            this.onTabChange(2);
                          }}
                        >
                          <a className="nav-link" data-toggle="tab">
                          Treated Patients
                          </a>
                        </li>
                        <li
                          className="nav-item mr-1"
                          id="bacicTab3-3"
                          role="presentation"
                          onClick={() => {
                            this.onTabChange(3);
                          }}
                        >
                          <a className="nav-link" data-toggle="tab">
                            
                          </a>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div id="bacicTab3pan-1" className="tab-pane show active">
                          <div className="col-lg-12">
                          <div className="card">
                            <TablePatientInfirmier/>
                          </div>
                        </div>
                        </div>
                        <div id="bacicTab3pan-2" className="tab-pane ">
                          <div className="col-lg-12">
                          <div className="card">
                            <TablePatientInfirmierTraite />
                          </div>
                        </div>
                        </div>
                        <div id="bacicTab3pan-3" className="tab-pane">
                          <div className="col-lg-12">
                          <div className="card">
                            <PresentPatientTableData /> 
                          </div>
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({});

export default connect(mapStateToProps, {})(Infirmier);
