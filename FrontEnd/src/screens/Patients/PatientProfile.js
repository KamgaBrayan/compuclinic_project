import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { wapp } from "../../Data/Consts";
import PatientProfileData from "../../dataComponents/PatientProfileData";

class PatientProfile extends React.Component {
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
              HeaderText="Secretariat"
              Breadcrumb={[
                { name: "Patients", navigate: `${wapp.DEPARTMENT.SECRETARY}` },
                { name: "Patient Folder", navigate: `${wapp.CURRENT_PAGE}` },
              ]}
            />
            <div className="row clearfix">
              <>
                <PatientProfileData />
              </>
            </div>
            
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default connect(mapStateToProps, {})(PatientProfile);
