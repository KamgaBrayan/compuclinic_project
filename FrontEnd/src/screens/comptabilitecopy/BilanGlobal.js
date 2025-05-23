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
      selectedDiv: 0, // Index of the div with the box-shadow
      typeDonnee: 'entree',
      donnee:{
        global:[['Entrée',[30,153,906,14250]],['Sortie',[18,103,706,12250]],['Dette',[4,10,131,1250]],['Bénéfice',[8,40,75,1750]]],
        entree:[['Pharmacie',[30,153,906,14250]],['Consultation',[18,103,706,12250]],['Internement',[4,10,131,1250]],['Opération',[8,40,75,1750]],['Examen',[18,103,706,12250]]],
        sortie:[['Achat matériel et équipement',[30,153,906,14250]],['Salaires',[18,103,706,12250]],['Primes',[4,10,131,1250]],['Impots',[8,40,75,1750]],['Dépense courante',[30,153,906,14250]],['Achat médicaments',[18,103,706,12250]]],
        dette:[['Nom1(investissement)',[30,153,906,14250]],['Nom2(pret)',[18,103,706,12250]],['Nom3(investissement)',[4,10,131,1250]]],
        actionnariat:[['Nom Actionnaire 1',[30,153,906,14250]],['Nom Actionnaire 2',[18,103,706,12250]],['Nom Actionnaire 3',[4,10,131,1250]],['Nom Actionnaire 4',[8,40,75,1750]]],
        
      },
      nomDonnee:{ global:'Global',entree: 'Entrée',sortie: 'Sortie',dette: 'Dette',actionnariat:'Actiionnariat',donnation:'Donnation'}
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
                { name: "Comptabilite", navigate: "comptabilite" },
                { name: "Pharmacie", navigate: "cpharmacie" },
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
                          {index === 0 ? "" : index === 1 ? "" : ""}
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
                    <HistogramChart i={this.state.i} typeDonnee={this.state.typeDonnee} values = {this.state.donnee.global} nomDonnee ={this.state.nomDonnee.global}/>
                  </div>
                  <a href="/cpharmacie" className="nav-link" data-toggle="tab">
                        <h4>‣ Entree</h4>
                  </a>
                  <div style={{ margin: "20px", padding: "40px", borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
                    <HistogramChart i={this.state.i} typeDonnee={this.state.typeDonnee} values = {this.state.donnee.entree} nomDonnee ={this.state.nomDonnee.entree}/>
                  </div>
                  <a href="/cpharmacie" className="nav-link" data-toggle="tab">
                        <h4>‣ Sortie</h4> 
                  </a>
                  <div style={{ margin: "20px", padding: "40px", borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
                    <HistogramChart i={this.state.i} typeDonnee={this.state.typeDonnee} values = {this.state.donnee.sortie} nomDonnee ={this.state.nomDonnee.sortie}/>
                  </div>
                  <a href="/cpharmacie" className="nav-link" data-toggle="tab">
                        <h4>‣ Dette</h4> 
                  </a>
                  <div style={{ margin: "20px", padding: "40px", borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
                    <HistogramChart i={this.state.i} typeDonnee={this.state.typeDonnee} values = {this.state.donnee.dette} nomDonnee ={this.state.nomDonnee.dette}/>
                  </div>
                  <a href="/cpharmacie" className="nav-link" data-toggle="tab">
                        <h4>Actionnariat </h4> 
                  </a>
                  <div style={{ margin: "20px", padding: "40px", borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
                    <HistogramChart i={this.state.i} typeDonnee={this.state.typeDonnee} values = {this.state.donnee.actionnariat} nomDonnee ={this.state.nomDonnee.actionnariat}/>
                  </div>


                    <div style={{ margin: "20px", padding: "40px", borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
                      <TableBilan i={this.state.i} typeDonnee={this.state.typeDonnee} values = {this.state.donnee.global} />
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
