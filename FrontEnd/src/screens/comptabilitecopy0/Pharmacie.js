import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { Dropdown } from "react-bootstrap";
import Department from "../../components/Forms/BasicValidation";
import HistogramChart from "./HistogramChart";
import TableBilan from "./Table";

// import AdvancedValidation from "../../components/Forms/AdvancedValidation";

class Pharmacie extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  constructor(props) {
    super(props);
    this.state = {
      i: 0, // Valeur initiale de l'attribut 'i'
      selectedDiv: 0, // Index of the div with the box-shadow
      typeDonnee: 'entree'
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
 onDivClick = (index) => {
    this.setState({ selectedDiv: index });
    if (index === 0) {this.setState({ typeDonnee: 'entree' });}
    else if (index === 1) {this.setState({ typeDonnee: 'sortie'});}
    else  {this.setState({ typeDonnee: 'bilan' });}
  };
    
  


  render() {
    const { selectedDiv } = this.state;


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
              <div className="card" style={{  boxShadow: "8px 8px 8px 8px rgba(0,0,0,0.2)" }}>
                <div className="header" style={{ display: "flex", border: "1px solid white" }}>
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      style={{
                        margin: "0 10px",
                        border: "1px solid #0d97ff",
                        borderRadius: "2px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        backgroundColor: selectedDiv === index ? "#0d97ff" : "",
                        boxShadow: selectedDiv === index ? "0 10px 10px 0 rgba(0,0,7,0.6)" : "",
                      }}
                      onClick={() => this.onDivClick(index)}
                    >
                      <div style={{ padding: "3px", textAlign: "center" }}>
                        <h2 style={{ margin: "3px" }}>
                          {index === 0 ? "Entree" : index === 1 ? "Sortie" : "Bilan"}
                        </h2>
                      </div>
                      <hr style={{ width: "100%", margin: 0, borderTop: "1px solid #0d97ff" }} />
                    </div>
                  ))}
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
                    <HistogramChart i={this.state.i} typeDonnee={this.state.typeDonnee}/>
                  </div>

                    <div style={{ margin: "20px", padding: "40px", borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
                      <TableBilan i={this.state.i} typeDonnee={this.state.typeDonnee} />
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

export default connect(mapStateToProps, {})(Pharmacie);
