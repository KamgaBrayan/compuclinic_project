import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import Department from "../../components/Forms/BasicValidation";
import { ConsultationsTableData } from "../../dataComponents/ConsultationDataComponent";
import { CardModalHeader, ValidationModal } from "../../dataComponents/utils";
import { wapp } from "../../Data/Consts";
import { CreateConsultationFormModal, EditConsultationFormModal } from "../Doctors/Consultation";
import { TableConsultations } from "../../components/Tables/TableConsultations";
import { TableConsultationsNotTreated } from "../../components/Tables/TableConsultationNotTreated";

class Medicine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treated: false,
      activeTab: "consultations-non-traitees",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleTabClick = (tab) => {
    this.setState({ activeTab: tab, treated: tab === "consultations-traitees" });
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
              HeaderText="Consultations médicales"
              Breadcrumb={[
                { name: "Departments", navigate: `${wapp.DEPARTMENT.ALL}` },
                { name: "Medecine", navigate: `${wapp.DEPARTMENT.MEDECINE}` },
              ]}
            />
            <div>
              <div className="col-lg-12 col-md-12">
                <div className="card">
                  <CreateConsultationFormModal />
                  <EditConsultationFormModal />
                  <ValidationModal />
                  <div className="body">
                    <CardModalHeader headerText="Consultations Médicales" modalId="createConsultationModal" />
                    <ul className="nav nav-tabs-new2" role="tablist">
                      <li
                        className={`nav-item mr-1 ${
                          this.state.activeTab === "consultations-non-traitees" ? "active" : ""
                        }`}
                      >
                        <a
                          className={`nav-link ${
                            this.state.activeTab === "consultations-non-traitees" ? "active" : ""
                          }`}
                          onClick={() => this.handleTabClick("consultations-non-traitees")}
                          style={{ cursor: "pointer" }}
                        >
                          Consultations non traitées
                        </a>
                      </li>
                      <li
                        className={`nav-item mr-1 ${
                          this.state.activeTab === "consultations-traitees" ? "active" : ""
                        }`}
                      >
                        <a
                          className={`nav-link ${
                            this.state.activeTab === "consultations-traitees" ? "active" : ""
                          }`}
                          onClick={() => this.handleTabClick("consultations-traitees")}
                          style={{ cursor: "pointer" }}
                        >
                          Consultations traitées
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div id="bacicTab3pan-1" className="tab-pane show active">
                        <div className="col-lg-12">
                          <div className="card">
                            {this.state.treated ? (
                              <TableConsultations />
                            ) : (
                              <TableConsultationsNotTreated />
                            )}
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
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({});

export default connect(mapStateToProps, {})(Medicine);