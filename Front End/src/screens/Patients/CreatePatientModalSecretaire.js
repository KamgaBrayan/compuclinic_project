import React, { useState, useEffect } from "react";
import { Countries, Languages, TimeZones,Services } from "../../Data/Consts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson, faWeight } from "@fortawesome/free-solid-svg-icons";
import { wServer } from "../../Data/Consts";
import { Toast } from "react-bootstrap";
import axios from 'axios';

export const CreatePatientFormModalSecretaire = ({ isModalOpen=false }) => {

    //const [modalStatus,setModalStatus] = useState(false)

    //isModalOpen && setModalStatus(true);
    const [state,setState] = useState({
        loading: false,
        toast : false,
        toast_type : "success", //success, danger, info, warning, primary
        toast_title : "Notification",
        toast_content : "L'opération a réussi!</br> Voir le <a href='/doctor/'>docteur</a>",
        toast_other : {
          field_validation: (field) => `Error with field ${field}`,
        },
        errors: {}
    })
    const [selectedSex, setSelectedSex] = useState('');
    const [selectedService, setSelectedService] = useState('');

    const validateForm = () => {
        const errors = {};
        const firstName = document.getElementById("firstname-create-patient").value;
        const lastName = document.getElementById("lastname-create-patient").value;
        const birthDate = document.getElementById("birthdate-create-patient").value;

        if (!firstName) {
            errors.firstName = 'Le prénom est obligatoire';
        }
        if (!lastName) {
            errors.lastName = 'Le nom est obligatoire';
        }
        if (!birthDate) {
            errors.birthDate = 'La date de naissance est obligatoire';
        }
        if (!selectedSex) {
            errors.sex = 'Le sexe est obligatoire';
        }
        if (!selectedService) {
            errors.service = 'Le service est obligatoire';
        }

        setState(prev => ({ ...prev, errors }));
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field) => {
        setState(prev => ({
            ...prev,
            errors: {
                ...prev.errors,
                [field]: undefined
            }
        }));
    };

    const handleSexChange = (event) => {
        setSelectedSex(event.target.value);
        handleInputChange('sex');
    };

    const handleServiceChange = (event) => {
        setSelectedService(event.target.value);
        handleInputChange('service');
    };

    const submitPatient = (event) => {
        event.preventDefault();
        
        if (!validateForm()) {
            setState(prev => ({
                ...prev,
                toast: true,
                toast_type: "danger",
                toast_title: "Erreur de validation",
                toast_content: "Veuillez remplir tous les champs obligatoires"
            }));
            return;
        }

        setState(prev => ({...prev, loading: true}));
        let formContent = {
            firstName:document.getElementById("firstname-create-patient").value,
            lastName:document.getElementById("lastname-create-patient").value,
            birthDate:document.getElementById("birthdate-create-patient").value,
            sex:selectedSex,
            service:selectedService
        }
        console.log(formContent);
        console.log(selectedService);

        axios.post(`${wServer.CREATE.PATIENT}`, formContent) 
        .then((response) => {
          if (response.status === 200) {
            setState({...state, toast: true});
            setState({...state, toast_title:"Notification"});
            
            // Synchroniser avec le service correspondant
            switch(selectedService) {
              case 'Laboratoire':
                axios.post(`${wServer.CREATE.PATIENT_LAB}`, formContent);
                break;
              case 'Plateau technique':
                axios.post(`${wServer.CREATE.PATIENT_PLATEAU}`, formContent);
                break;
              case 'Psychiatrie':
              case 'Consultation':
              case 'Urgence':
              case 'Pediatrie':
                // Ajouter dans la table du médecin
                axios.post(`${wServer.CREATE.PATIENT_MEDECIN}`, {...formContent, status: 'non_traite'});
                // Ajouter dans la table de l'infirmier
                axios.post(`${wServer.CREATE.PATIENT_INFIRMIER}`, {...formContent, status: 'non_traite'});
                break;
            }

            //reset form fields
            document.getElementById("createPatientFormSecretaire").reset()
            //close modal
            document.getElementById("createPatientModalSecretaire").classList.toggle("show")
            return response.json();
          }
        })
        .then((result) => {
            console.log(result);
            setTimeout(()=> {
              setState({...state, loading:false})
              setState({...state, toast:false});
            }, 1500);
        })
        .catch(error => console.log('error', error)); 
    }

    return ( 
        <>
        {isModalOpen && document.getElementById("createPatientModalSecretaire")?.classList.toggle("show")}
        {state.toast ? (
          <Toast
            id="toast-container"
            show={state.toast}
            onClose={() => {
              setState({...state, toast:false});
            }}
            className={`toast-${state.toast_type} toast-bottom-right`}
            autohide={true}
            delay={5000}
          >
            <Toast.Header className={`toast-${state.toast_type} mb-0`}>
              {state.toast_title}
            </Toast.Header>
          </Toast>
        ) : null}
      <div
        id="createPatientModalSecretaire"
        //className={isModalOpen ? "modal fade show" : "modal fade"}
        className={"modal fade"}
        role="dialog"
      >
        <form id="createPatientFormSecretaire" onSubmit={submitPatient}>
            <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                <h4 className="title" id="defaultModalLabel">
                    Add Patient
                </h4>
                </div>
                <div className="modal-body">
                    <div className="row clearfix">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <input
                                    type="text"
                                    className={`form-control ${state.errors.firstName ? 'is-invalid' : ''}`}
                                    placeholder="First Name"
                                    id="firstname-create-patient"
                                    onChange={() => handleInputChange('firstName')}
                                />
                                {state.errors.firstName && (
                                    <div className="invalid-feedback">
                                        {state.errors.firstName}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group">
                                <input
                                    type="text"
                                    className={`form-control ${state.errors.lastName ? 'is-invalid' : ''}`}
                                    placeholder="Last Name"
                                    id="lastname-create-patient"
                                    onChange={() => handleInputChange('lastName')}
                                />
                                {state.errors.lastName && (
                                    <div className="invalid-feedback">
                                        {state.errors.lastName}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group">
                                <input
                                    type="date"
                                    className={`form-control ${state.errors.birthDate ? 'is-invalid' : ''}`}
                                    placeholder="Birth Date"
                                    id="birthdate-create-patient"
                                    onChange={() => handleInputChange('birthDate')}
                                />
                                {state.errors.birthDate && (
                                    <div className="invalid-feedback">
                                        {state.errors.birthDate}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group">
                                <select 
                                    className={`form-control ${state.errors.sex ? 'is-invalid' : ''}`}
                                    value={selectedSex}
                                    onChange={handleSexChange}
                                    required
                                >
                                    <option value="">Select Sex</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                                {state.errors.sex && (
                                    <div className="text-danger small">
                                        {state.errors.sex}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group">
                                <select 
                                    className={`form-control ${state.errors.service ? 'is-invalid' : ''}`}
                                    value={selectedService}
                                    onChange={handleServiceChange}
                                    required
                                >
                                    <option value="">Select Service</option>
                                    <option value="Laboratoire">Laboratoire</option>
                                    <option value="Plateau technique">Plateau technique</option>
                                    <option value="Psychiatrie">Psychiatrie</option>
                                    <option value="Consultation">Consultation</option>
                                    <option value="Urgence">Urgence</option>
                                    <option value="Pediatrie">Pédiatrie</option>
                                </select>
                                {state.errors.service && (
                                    <div className="invalid-feedback">
                                        {state.errors.service}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer row clearfix">
                    <div className="col">
                        <button type="submit" className="btn btn-primary btn-block"
                            onClick={submitPatient}
                        >
                            Add
                        </button>
                </div>
                <div className="col">
                    <button
                        type="button"
                        onClick={() => {
                        document.getElementById("createPatientModalSecretaire").classList.toggle("show")
                        }}
                        className="btn btn-simple btn-block btn-danger"
                        data-dismiss="modal"
                    >
                        CLOSE
                    </button>
                </div>
                </div>
            </div>
            </div>
        </form>
      </div>
      </>
    );

}

export const EditPatientFormModalSecretaire = ({ isModalOpen=false }) => {

    //const [modalStatus,setModalStatus] = useState(false)

    //isModalOpen && setModalStatus(true);
    const [state,setState] = useState({
        loading: false,
        toast : false,
        toast_type : "success", //success, danger, info, warning, primary
        toast_title : "Notification",
        toast_content : "L'opération a réussi!</br> Voir le <a href='/doctor/'>docteur</a>",
        toast_other : {
          field_validation: (field) => `Error with field ${field}`,
        }
    })

    const editPatient = (event) => {
        event.preventDefault()
        setState({...state, loading:false})
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
            setState({...state, toast: true});
            setState({...state, toast_title:"Notification"});
            return response.json();
          }
        })
        .then((result) => {
            console.log(result);
            setTimeout(()=> {
              setState({...state, loading:false})
              setState({...state, toast:false});
            }, 1500);
        })
        .catch(error => console.log('error', error)); 
    }

    return ( 
        <>
        {isModalOpen && document.getElementById("editPatientModalSecretaire")?.classList.toggle("show")}
        {state.toast ? (
          <Toast
            id="toast-container"
            show={state.toast}
            onClose={() => {
              setState({...state, toast:false});
            }}
            className={`toast-${state.toast_type} toast-bottom-right`}
            autohide={true}
            delay={5000}
          >
            <Toast.Header className={`toast-${state.toast_type} mb-0`}>
              {state.toast_title}
            </Toast.Header>
          </Toast>
        ) : null}
      <div
        id="editPatientModalSecretaire"
        //className={isModalOpen ? "modal fade show" : "modal fade"}
        className={"modal fade"}
        role="dialog"
      >
        <form id="editPatientFormSecretaire" onSubmit={editPatient}>
            <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                <h4 className="title" id="defaultModalLabel">
                    Edit Patient
                </h4>
                </div>
                <div className="modal-body">
                    <div className="row clearfix">
                        <div className="col-lg-12 col-md-12">
                            
                            <div className="row clearfix">
                                {" "}
                                <div className="col-md-3">
                                    <label>
                                        <small className="text-muted">Temperature</small>
                                    </label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <>°C</>
                                            </span>
                                            </div>
                                            <input
                                            data-provide="datepicker"
                                            data-date-autoclose="true"
                                            className="form-control"
                                            placeholder=""
                                            />
                                        </div>
                                    </div>
                                </div>
                                {" "}
                                <div className="col-md-3">
                                    <label>
                                        <small className="text-muted">Weight</small>
                                    </label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                            <span className="input-group-text">
                                            <FontAwesomeIcon icon={faWeight} size="xl" />
                                            </span>
                                            </div>
                                            <input
                                            data-provide="datepicker"
                                            data-date-autoclose="true"
                                            className="form-control"
                                            placeholder=""
                                            />
                                        </div>
                                    </div>
                                </div>
                                {" "}
                                <div className="col-md-3">
                                    <label>
                                        <small className="text-muted">Height</small>
                                    </label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                            <span className="input-group-text">
                                            <FontAwesomeIcon icon={faPerson} size="xl" />
                                            </span>
                                            </div>
                                            <input
                                            data-provide="datepicker"
                                            data-date-autoclose="true"
                                            className="form-control"
                                            placeholder=""
                                            />
                                        </div>
                                    </div>
                                </div>
                                {" "}
                                <div className="col-md-3">
                                    <label>
                                        <small className="text-muted">Pressure</small>
                                    </label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <i className="icon-drop"></i>
                                            </span>
                                            </div>
                                            <input
                                            data-provide="datepicker"
                                            data-date-autoclose="true"
                                            className="form-control"
                                            placeholder=""
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row clearfix">
                                <div className="col-md-6">
                                    <label>
                                        <small className="text-muted">First Name</small>
                                    </label>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder=""
                                            id="firstname-edit-patient"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label>
                                        <small className="text-muted">Last Name</small>
                                    </label>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder=""
                                            id="lastname-edit-patient"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            
                            <div className="form-group">
                                <label>
                                    <small className="text-muted">Birth Date</small>
                                </label>
                                <div className="form-group">
                                    <input
                                        type="date"
                                        className="form-control"
                                        placeholder=""
                                        id="birthdate-edit-patient"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>
                                    <small className="text-muted">Gender <br /></small>
                                </label>
                                <div>
                                    <label className="fancy-radio">
                                        <input name="gender2" defaultValue="male" type="radio" value="M" />
                                        <span><i></i>Male</span>
                                    </label>
                                    <label className="fancy-radio">
                                        <input name="gender2" defaultValue="female" type="radio" value="F" />
                                        <span><i></i>Female</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                        
                            {" "}
                            <label>
                            <small className="text-muted">Nationalité</small>
                            </label>
                            <div className="form-group">
                            <select className="form-control" 
                                defaultValue="CM" 
                                defaultChecked=""
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
                </div>
                <div className="modal-footer row clearfix">
                    <div className="col">
                        <button type="submit" className="btn btn-primary btn-block"
                        >
                            Edit
                        </button>
                </div>
                <div className="col">
                    <button
                        type="button"
                        onClick={() => {
                        document.getElementById("editPatientModalSecretaire").classList.toggle("show")
                        }}
                        className="btn btn-simple btn-block btn-danger"
                        data-dismiss="modal"
                    >
                        CLOSE
                    </button>
                </div>
                </div>
            </div>
            </div>
        </form>
      </div>
      </>
    );

}

export default EditPatientFormModalSecretaire;
