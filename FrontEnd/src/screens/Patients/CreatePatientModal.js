import React, { useState } from "react";
import { Countries, Languages, TimeZones } from "../../Data/Consts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson, faWeight } from "@fortawesome/free-solid-svg-icons";
import { wServer } from "../../Data/Consts";
import { Toast } from "react-bootstrap";

export const CreatePatientFormModal = ({ isModalOpen=false }) => {

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

    const validateForm = () => {
        const form = document.getElementById("createPatientForm");
        const formData = new FormData(form);
        const errors = {};
        const requiredFields = ['temperature', 'weight', 'height', 'prenom', 'nom', 'date_naissance', 'sexe'];

        requiredFields.forEach(field => {
            if (!formData.get(field)) {
                errors[field] = 'Ce champ est obligatoire';
                const input = form.querySelector(`[name="${field}"]`);
                if (input) {
                    input.classList.add('is-invalid');
                }
            }
        });

        setState({...state, errors});
        return Object.keys(errors).length === 0;
    };

    const submitPatient = (event) => {
        event.preventDefault();
        
        if (!validateForm()) {
            setState({
                ...state,
                toast: true,
                toast_type: "danger",
                toast_title: "Erreur de validation",
                toast_content: "Veuillez remplir tous les champs obligatoires"
            });
            return;
        }

        setState({...state, loading: true});
        var formContent = new FormData(document.getElementById("createPatientForm"));
        fetch(`${wServer.CREATE.PATIENT}`, {
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
            //reset form fields
            document.getElementById("createPatientForm").reset()
            //close modal
            document.getElementById("createPatientModal").classList.toggle("show")
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
        {isModalOpen && document.getElementById("createPatientModal")?.classList.toggle("show")}
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
            <Toast.Body>
                {state.toast_content}
            </Toast.Body>
          </Toast>
        ) : null}
      <div
        id="createPatientModal"
        //className={isModalOpen ? "modal fade show" : "modal fade"}
        className={"modal fade"}
        role="dialog"
      >
        <form id="createPatientForm" onSubmit={submitPatient}>
            <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                <h4 className="title" id="defaultModalLabel">
                    Add Patient
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
                                            className={`form-control ${state.errors.temperature ? 'is-invalid' : ''}`}
                                            placeholder=""
                                            name="temperature"
                                            required
                                            onChange={() => {
                                                const newErrors = {...state.errors};
                                                delete newErrors.temperature;
                                                setState({...state, errors: newErrors});
                                            }}
                                            />
                                            {state.errors.temperature && (
                                                <div className="invalid-feedback">
                                                    {state.errors.temperature}
                                                </div>
                                            )}
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
                                            className={`form-control ${state.errors.weight ? 'is-invalid' : ''}`}
                                            placeholder=""
                                            name="weight"
                                            required
                                            onChange={() => {
                                                const newErrors = {...state.errors};
                                                delete newErrors.weight;
                                                setState({...state, errors: newErrors});
                                            }}
                                            />
                                            {state.errors.weight && (
                                                <div className="invalid-feedback">
                                                    {state.errors.weight}
                                                </div>
                                            )}
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
                                            className={`form-control ${state.errors.height ? 'is-invalid' : ''}`}
                                            placeholder=""
                                            name="height"
                                            required
                                            onChange={() => {
                                                const newErrors = {...state.errors};
                                                delete newErrors.height;
                                                setState({...state, errors: newErrors});
                                            }}
                                            />
                                            {state.errors.height && (
                                                <div className="invalid-feedback">
                                                    {state.errors.height}
                                                </div>
                                            )}
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
                                            className="form-control"
                                            placeholder=""
                                            name="pressure"
                                            required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row clearfix px-3">
                                <div className="form-group w-100">
                                    <input
                                        type="text"
                                        data-provide="datepicker"
                                        data-date-autoclose="true"
                                        className={`form-control ${state.errors.date_naissance ? 'is-invalid' : ''}`}
                                        placeholder="Date de naissance"
                                        name="date_naissance"
                                        required
                                        onChange={() => {
                                            const newErrors = {...state.errors};
                                            delete newErrors.date_naissance;
                                            setState({...state, errors: newErrors});
                                        }}
                                    />
                                    {state.errors.date_naissance && (
                                        <div className="invalid-feedback">
                                            {state.errors.date_naissance}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="row clearfix">
                                <div className="col-md-6">
                                    {/* <label>
                                        <small className="text-muted">First Name</small>
                                    </label> */}
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className={`form-control ${state.errors.prenom ? 'is-invalid' : ''}`}
                                            placeholder="First Name"
                                            name="prenom"
                                            required
                                            onChange={() => {
                                                const newErrors = {...state.errors};
                                                delete newErrors.prenom;
                                                setState({...state, errors: newErrors});
                                            }}
                                        />
                                        {state.errors.prenom && (
                                            <div className="invalid-feedback">
                                                {state.errors.prenom}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    {/* <label>
                                        <small className="text-muted">Last Name</small>
                                    </label> */}
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className={`form-control ${state.errors.nom ? 'is-invalid' : ''}`}
                                            placeholder="Last Name"
                                            name="nom"
                                            required
                                            onChange={() => {
                                                const newErrors = {...state.errors};
                                                delete newErrors.nom;
                                                setState({...state, errors: newErrors});
                                            }}
                                        />
                                        {state.errors.nom && (
                                            <div className="invalid-feedback">
                                                {state.errors.nom}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>
                                    <small className="text-muted">Gender <br /></small>
                                </label>
                                <div>
                                    <label className="fancy-radio">
                                        <input name="sexe" value="M" type="radio" required
                                        onChange={() => {
                                            const newErrors = {...state.errors};
                                            delete newErrors.sexe;
                                            setState({...state, errors: newErrors});
                                        }}
                                        />
                                        <span><i></i>Male</span>
                                    </label>
                                    <label className="fancy-radio">
                                        <input name="sexe" value="F" type="radio" required
                                        onChange={() => {
                                            const newErrors = {...state.errors};
                                            delete newErrors.sexe;
                                            setState({...state, errors: newErrors});
                                        }}
                                        />
                                        <span><i></i>Female</span>
                                    </label>
                                    {state.errors.sexe && (
                                        <div className="invalid-feedback">
                                            {state.errors.sexe}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="row clearfix px-3">
                                <div className="form-group w-100">
                                    <textarea
                                        className="form-control"
                                        style={{height:50}}
                                        placeholder="Sympthomes (ex: Maux de tête, vertiges, etc)"
                                        name="symptomes"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row clearfix px-3">
                                <div className="form-group w-100">
                                    <textarea
                                        className="form-control"
                                        style={{height:50}}
                                        placeholder="Antécédents (ex: allergie au Clore, Opération du foi, etc)"
                                        name="antecedent"
                                    />
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
                </div>
                <div className="modal-footer row clearfix">
                    <div className="col">
                        <button type="submit" className="btn btn-primary btn-block"
                            // onClick={() => {
                            //     document.getElementById("createPatientModal").classList.toggle("show")
                            // }}
                        >
                            Add
                        </button>
                </div>
                <div className="col">
                    <button
                        type="button"
                        onClick={() => {
                        document.getElementById("createPatientModal").classList.toggle("show")
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

export const EditPatientFormModal = ({ isModalOpen=false }) => {

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
        {isModalOpen && document.getElementById("editPatientModal")?.classList.toggle("show")}
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
        id="editPatientModal"
        //className={isModalOpen ? "modal fade show" : "modal fade"}
        className={"modal fade"}
        role="dialog"
      >
        <form id="editPatientForm" onSubmit={editPatient}>
            <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                <h4 className="title" id="defaultModalLabel">
                    Add Patient
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
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            
                            <div className="form-group">
                                <label>
                                    <small className="text-muted">Gender <br /></small>
                                </label>
                                <div>
                                    <label className="fancy-radio">
                                        <input name="gender2" defaultValue="male" type="radio" />
                                        <span><i></i>Male</span>
                                    </label>
                                    <label className="fancy-radio">
                                        <input name="gender2" defaultValue="female" type="radio"/>
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
                        <button type="button" className="btn btn-primary btn-block"
                            onClick={() => {
                                document.getElementById("editPatientModal").classList.toggle("show")
                            }}
                        >
                            Add
                        </button>
                </div>
                <div className="col">
                    <button
                        type="button"
                        onClick={() => {
                        document.getElementById("editPatientModal").classList.toggle("show")
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
