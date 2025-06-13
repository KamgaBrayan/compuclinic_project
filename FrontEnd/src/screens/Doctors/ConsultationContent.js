import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { wapp } from "../../Data/Consts";
import ConsultationContentData from "../../dataComponents/ConsultationContentData";

class ConsultationContent extends React.Component {
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
              HeaderText="Consultations"
              Breadcrumb={[
                { name: "Consultations", navigate: `${wapp.DEPARTMENT.MEDECINE}` },
                { name: "Content : patient name", navigate: `${wapp.CURRENT_PAGE}` },
              ]}
            />
            <div className="row clearfix">
              <>
                <ConsultationContentData />
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

export default connect(mapStateToProps, {})(ConsultationContent);
