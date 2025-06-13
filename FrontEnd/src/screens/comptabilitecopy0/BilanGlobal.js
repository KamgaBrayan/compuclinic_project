import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { Dropdown } from "react-bootstrap";
import Department from "../../components/Forms/BasicValidation";
import HistogramChart from "./HistogramChart";
import TableBilan from "./Table";
// import AdvancedValidation from "../../components/Forms/AdvancedValidation";

class BilanGlobal extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  constructor(props) {
    super(props);
    this.state = {
      i: 0, // Valeur initiale de l'attribut 'i'
    };
  }

  // Fonction pour modifier la valeur de 'i'


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
    var tab4 = document.getElementById("bacicTab3-4");
    tab4.classList.remove("active");
    tab4.children[0].classList.remove("active");

    var actab = document.getElementById("bacicTab3-" + e);
    actab.classList.add("active");
    actab.children[0].classList.add("active");

    this.setState({ i: e-1 });

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
              HeaderText="Comptabilite"
              Breadcrumb={[
                { name: "Comptabilite", navigate: "" },
                { name: "Bilan Global", navigate: "" },
              ]}
            />
            <div className="col-lg-12 col-md-12">
            <div className="card">
              <div className="header">
                <h2>
                Bilan Global
                </h2>
              </div>
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
                    <a className="nav-link active">Aujourd'hui</a>
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
                      Cette semaine
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
                      Ce mois
                    </a>
                  </li>
                  <li
                    className="nav-item mr-1"
                    id="bacicTab3-4"
                    role="presentation"
                    onClick={() => {
                      this.onTabChange(4);
                    }}
                  >
                    <a className="nav-link" data-toggle="tab">
                      Cette annnee
                    </a>
                  </li>
                </ul>
                <div style={{ margin: "20px", padding: "40px", borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
                  <HistogramChart i={this.state.i} />
                </div>

                  <div style={{ margin: "20px", padding: "40px", borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
                    <TableBilan i={this.state.i} />
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

export default connect(mapStateToProps, {})(BilanGlobal);
