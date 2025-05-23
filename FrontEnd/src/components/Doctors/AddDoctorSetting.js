import React from "react";
import { connect } from "react-redux";
import { Countries, Languages, TimeZones, wServer } from "../../Data/Consts";
import { Toast } from "react-bootstrap";

class AddDoctorSetting extends React.Component {
  
  constructor() {
    super();

    this.state = {
      loading: false,
      toast : false,
      toast_type : "success", //success, danger, info, warning, primary
      toast_title : "Notification",
      toast_content : "L'opération a réussi!</br> Voir le <a href='/doctor/'>docteur</a>",
      toast_other : {
        field_validation: (field) => `Error with field ${field}`
      },
      errors: {}
    }
  }

  validateForm = () => {
    const form = document.getElementById("addDoctorForm");
    const formData = new FormData(form);
    const errors = {};
    const requiredFields = ['prenom', 'nom', 'date_naissance', 'sexe', 'specialite', 'email', 'telephone'];

    requiredFields.forEach(field => {
      if (!formData.get(field)) {
        errors[field] = 'Ce champ est obligatoire';
        const input = form.querySelector(`[name="${field}"]`);
        if (input) {
          input.classList.add('is-invalid');
        }
      }
    });

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleInputChange = (field) => {
    const newErrors = {...this.state.errors};
    delete newErrors[field];
    this.setState({ errors: newErrors });
  };

  render() {
    const onSubmit = (event) => {
      event.preventDefault();
      
      if (!this.validateForm()) {
        this.setState({
          toast: true,
          toast_type: "danger",
          toast_title: "Erreur de validation",
          toast_content: "Veuillez remplir tous les champs obligatoires"
        });
        return;
      }

      this.setState({loading: true});
      var formContent = new FormData(document.getElementById("addDoctorForm"));
      fetch(`${wServer.CREATE.DOCTOR}`, {
        method: 'POST',
        redirect: 'follow',
        headers: {'Authorization': `Token ${localStorage.getItem("_compuclinicToken")}`},
        // body:{...formContent},
        body: formContent,
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({...this.state, toast: true});
          this.setState({...this.state, toast_title:"Notification"});
          return response.json();
        }
      })
      .then((result) => {
          console.log(result);
          setTimeout(()=> {
            this.setState({...this.state, loading:false})
            this.setState({...this.state, toast:false});
          }, 1500);
      })
      .catch(error => console.log('error', error)); 
    }
    return (
      
      <div>
        {this.state.toast ? (
          <Toast
            id="toast-container"
            show={this.state.toast}
            onClose={() => {
              this.setState({...this.state, toast:false});
            }}
            className={`toast-${this.state.toast_type} toast-bottom-right`}
            autohide={true}
            delay={5000}
          >
            <Toast.Header className={`toast-${this.state.toast_type} mb-0`}>
              {this.state.toast_title}
            </Toast.Header>
            <Toast.Body>
              {this.state.toast_content}
            </Toast.Body>
          </Toast>
        ) : null}
        
          <h6>Personal Information</h6>
          <form id="addDoctorForm" onSubmit={onSubmit}>
            <div className="row clearfix">
              <div className="col-lg-6 col-md-12">
                <div className="form-group">
                  <input
                    className={`form-control ${this.state.errors.prenom ? 'is-invalid' : ''}`}
                    name="prenom"
                    placeholder="First Name"
                    type="text"
                    required
                    onChange={() => this.handleInputChange('prenom')}
                  />
                  {this.state.errors.prenom && (
                    <div className="invalid-feedback">
                      {this.state.errors.prenom}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  {/* YYYY-MM-DD */}
                  <input
                    className={`form-control ${this.state.errors.date_naissance ? 'is-invalid' : ''}`}
                    name="date_naissance" 
                    // type="date"
                    data-date-autoclose="true"
                    data-provide="datepicker"
                    placeholder="DateBirth"
                    required
                    onChange={() => this.handleInputChange('date_naissance')}
                  />
                  {this.state.errors.date_naissance && (
                    <div className="invalid-feedback">
                      {this.state.errors.date_naissance}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <div>
                    <label className="fancy-radio">
                      <input
                        name="sexe"
                        value="M"
                        type="radio"
                        required
                        onChange={() => this.handleInputChange('sexe')}
                      />
                      <span>
                        <i></i>Male
                      </span>
                    </label>
                    <label className="fancy-radio">
                      <input
                        name="sexe"
                        value="F"
                        type="radio"
                        required
                        onChange={() => this.handleInputChange('sexe')}
                      />
                      <span>
                        <i></i>Female
                      </span>
                    </label>
                    {this.state.errors.sexe && (
                      <div className="invalid-feedback d-block">
                        {this.state.errors.sexe}
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="icon-calendar"></i>
                      </span>
                    </div>
                    <input
                      className={`form-control ${this.state.errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      placeholder="Enter your mail"
                      type="email"
                      required
                      onChange={() => this.handleInputChange('email')}
                    />
                  </div>
                  {this.state.errors.email && (
                    <div className="invalid-feedback">
                      {this.state.errors.email}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    name="matricule"
                    placeholder="Matricule"
                    type="text"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-12">
                <div className="form-group">
                  <input
                    className={`form-control ${this.state.errors.nom ? 'is-invalid' : ''}`}
                    name="nom"
                    placeholder="Last Name"
                    type="text"
                    required
                    onChange={() => this.handleInputChange('nom')}
                  />
                  {this.state.errors.nom && (
                    <div className="invalid-feedback">
                      {this.state.errors.nom}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    name="lieu_naissance"
                    placeholder="Lieu de naissance"
                    type="text"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    name="domicile"
                    placeholder="Address"
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    name="CNI"
                    placeholder="CNI/Passport"
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <select className="form-control" 
                    defaultValue={'CM'} 
                    defaultChecked={'CM'}
                    name="nationalite"
                    >
                    <option value="">-- Select Country --</option>
                    {Countries.map((country, i)=>{
                    return (
                        <option key={country.code} value={country.code}>{country.name}</option>
                    )
                    })}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-12">
                <div className="form-group">
                  <input
                    className={`form-control ${this.state.errors.telephone ? 'is-invalid' : ''}`}
                    name="telephone"
                    placeholder="Phone Number"
                    type="text"
                    required
                    onChange={() => this.handleInputChange('telephone')}
                  />
                  {this.state.errors.telephone && (
                    <div className="invalid-feedback">
                      {this.state.errors.telephone}
                    </div>
                  )}
                </div>
                <div className="form-group">
                <select className="form-control" 
                    defaultValue={'en'} 
                    defaultChecked={'en'}
                    name="specialite"
                    required
                    onChange={() => this.handleInputChange('specialite')}
                    >
                    <option value="">Select Speciality</option>
                    <option value="Cardiologue">Cardiologue</option>
                    <option value="Dermatologue">Dermatologue</option>
                    <option value="Généraliste">Généraliste</option>
                    <option value="Gynécologue">Gynécologue</option>
                    <option value="Pédiatre">Pédiatre</option>
                  </select>
                  {this.state.errors.specialite && (
                    <div className="invalid-feedback">
                      {this.state.errors.specialite}
                    </div>
                  )}
                </div>
                <button className="btn btn-primary btn-block" type="submit">
                Submit
                </button>{" "}
                &nbsp;&nbsp;
                {/* <button className="btn btn-default" type="button">
                Cancel
                </button> */}
                </div>
            </div>
          </form>
      </div>
      
    );
  }
}

const mapStateToProps = ({ mailInboxReducer }) => ({});

export default connect(mapStateToProps, {})(AddDoctorSetting);
