import React, { useState } from "react";
import { Countries, DataListOf} from "../../Data/Consts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson, faWeight } from "@fortawesome/free-solid-svg-icons";
import { wServer } from "../../Data/Consts";
import { Toast } from "react-bootstrap";
import $ from 'jquery';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';


const animatedComponents = makeAnimated();

export const CreateConsultationFormModal = ({ isModalOpen=false }) => {

    const inlinestyle = {
        textarea : { height: "100px !important" }
    }
    // To style all selects
    $(document).ready(function () {
        
    });
    
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

    const submitConsultation = (event) => {
        event.preventDefault()
        setState({...state, loading:false})
        var formContent = new FormData(document.getElementById("createConsultationForm"));
        
        var formJsonContent = {};
        formContent.forEach((value, key) => {
            if(!formJsonContent[key]) {formJsonContent[key] = value}
            else {formJsonContent[key] += "," + value}
        })
        console.log(formContent)
        console.log(formJsonContent)
        //
        fetch(`${wServer.CREATE.CONSULTATION}`, {
          method: 'POST',
          redirect: 'follow',
          headers: {'Authorization': `Token ${localStorage.getItem("_compuclinicToken")}`},
          body: formContent,
        //   body: formJsonContent,
        })
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            setState({...state, toast: true});
            setState({...state, toast_title:"Notification"});
            //reset form fields
            document.getElementById("createConsultationForm").reset()
            //close modal
            document.getElementById("createConsultationModal").classList.toggle("show")
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

    const { datas: patientList, loading: loadingPatients, error: errorPatients } = DataListOf('patient');
    // Pour les médecins:
    const { datas: doctorList, loading: loadingDoctors, error: errorDoctors } = DataListOf('doctor');

    // ...

    // Gestion de l'état de chargement et des erreurs (exemple simple)
    if (loadingPatients || loadingDoctors) {
        // Vous pouvez afficher un indicateur de chargement dans le modal ou désactiver les selects
        // Pour l'instant, on peut juste logguer et retourner des options vides ou désactiver
        console.log("Chargement des listes de patients/médecins...");
    }

    if (errorPatients) {
        console.error("Erreur lors du chargement des patients:", errorPatients);
        // Gérer l'erreur, afficher un message à l'utilisateur
    }
    // Gestion des erreurs des médecins
    /*
    if (errorDoctors) {
        console.error("Erreur lors du chargement des médecins:", errorDoctors);
        // Gérer l'erreur
    }
    */
    return ( 
        <>
        {isModalOpen && document.getElementById("DataListOf")?.classList.toggle("show")}
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
                id="createConsultationModal"
                className={"modal fade"} // Gardez la gestion de l'ouverture comme avant
                role="dialog"
            >
                <form id="createConsultationForm" onSubmit={submitConsultation}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="title" id="defaultModalLabel">
                                    Add Consultation
                                </h4>
                            </div>
                            <div className="modal-body">
                                <div className="row clearfix">
                                    <div className="col-lg-12 col-md-12">
                                        <div className="row clearfix">
                                            <div className="col-md-12">
                                                <label>
                                                    <small className="text-muted">Patient</small>
                                                </label>
                                                <div className="form-group">
                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">
                                                                <FontAwesomeIcon icon={faPerson} size="xl" />
                                                            </span>
                                                        </div>
                                                        <Select
                                                            className="w-75"
                                                            closeMenuOnSelect={true}
                                                            components={animatedComponents}
                                                            isMulti={false}
                                                            // UTILISATION CORRECTE DE patientList
                                                            options={(Array.isArray(patientList) ? patientList : []).map((val) => {
                                                                return ({
                                                                    label: `${val.nom} ${val.prenom}`, // Assurez-vous que 'nom' et 'prenom' existent sur val
                                                                    value: val.id // Assurez-vous que 'id' existe sur val
                                                                });
                                                            })}
                                                            name="patient"
                                                            required
                                                            isLoading={loadingPatients} // react-select peut afficher un loader
                                                        />
                                                {/* <AsyncSelect /> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row clearfix px-3">
                                <div className="w-100">
                                    <textarea
                                        className="form-control"
                                        style={inlinestyle.textarea}
                                        rows={4}
                                        placeholder="Note au médecin"
                                        name="medecin_note"
                                    />
                                </div>
                                
                            </div>

                        </div>
                        <div className="col-lg-12 col-md-12">
                                        <label>
                                            <small className="text-muted">Médecin</small>
                                        </label>
                                        <div className="form-group">
                                            <Select
                                                className="w-100"
                                                closeMenuOnSelect={true}
                                                components={animatedComponents}
                                                isMulti={false}
                                                // UTILISATION CORRECTE DE doctorList
                                                options={(Array.isArray(doctorList) ? doctorList : []).map((val) => {
                                                    return ({
                                                        label: `${val.nom} ${val.prenom}`, // Assurez-vous que 'nom' et 'prenom' existent
                                                        value: val.id // Assurez-vous que 'id' existe
                                                    });
                                                })}
                                                name="medecin"
                                                required
                                                isLoading={loadingDoctors} // react-select peut afficher un loader
                                            />
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div className="modal-footer row clearfix">
                    <div className="col">
                        <button type="submit" className="btn btn-primary btn-block"
                            // onClick={() => {
                            //     document.getElementById("DataListOf").classList.toggle("show")
                            // }}
                        >
                            Add
                        </button>
                </div>
                <div className="col">
                    <button
                        type="button"
                        onClick={() => {
                        document.getElementById("DataListOf").classList.toggle("show")
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

export const EditConsultationFormModal = ({ isModalOpen=false }) => {

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

    const editConsultation = (event) => {
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
        {isModalOpen && document.getElementById("editConsultationModal")?.classList.toggle("show")}
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
        id="editConsultationModal"
        //className={isModalOpen ? "modal fade show" : "modal fade"}
        className={"modal fade"}
        role="dialog"
      >
        <form id="editConsultationForm" onSubmit={editConsultation}>
            <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                <h4 className="title" id="defaultModalLabel">
                    Add Consultation
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
                            <select className="selectpicker" 
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
                                document.getElementById("editConsultationModal").classList.toggle("show")
                            }}
                        >
                            Add
                        </button>
                </div>
                <div className="col">
                    <button
                        type="button"
                        onClick={() => {
                        document.getElementById("editConsultationModal").classList.toggle("show")
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
