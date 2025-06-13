/**
 * Render the user account widget.
 *
 * @returns {JSX.Element} The user account widget.
 */

import React, { useEffect, useState } from "react";
import { wServer, wapp } from "../Data/Consts";
import { Dropdown } from "react-bootstrap";
import UserImage from "../assets/images/user.png";

export function UserAccounWidget() {
    
    const [loading, setLoading] = useState(false)
    const [datas, setDatas] = useState({
        id:"00af074c-3d15-488d-adba-90305913a44e",
        username:"username",
        email:"email@mail.com",
        first_name: "",
        last_name: "",
    });

    useEffect(()=> {
      const loadDatas = async () => {
          setLoading(true);
          try {
              const response = await fetch(`${wServer.GET.LOGGED_IN}`, {
                  method: 'GET',
                  redirect: 'follow',
                  headers: {'Authorization': `Token ${localStorage.getItem("_compuclinicToken")}`}
              });
  
              if (!response.ok) { // Vérifie si le statut est dans la plage 200-299
                  // Gérer les erreurs HTTP (4xx, 5xx)
                  console.error(`HTTP error! status: ${response.status}`);
                  // Peut-être mettre à jour l'état pour afficher une erreur à l'utilisateur
                  // setDatas(valeursParDefautOuErreur); // Garder les valeurs par défaut ou un état d'erreur
                  setLoading(false);
                  return; // Sortir de la fonction si la réponse n'est pas OK
              }
  
              const result = await response.json();
  
              // Vérifier si result et result.data existent
              if (result && result.data) {
                  setDatas(result.data);
              } else if (result) {
                  // Si l'API renvoie directement l'objet utilisateur sans la clé 'data'
                  // Par exemple, si l'API renvoie { id: ..., username: ..., ... }
                  // Ajuste ceci en fonction de la réponse réelle de ton API /api/auth/log/
                  console.warn("La réponse de l'API ne contient pas de clé 'data'. Utilisation de 'result' directement.");
                  // Si tu sais que l'API /api/auth/log/ est censée renvoyer directement l'objet utilisateur:
                  // setDatas(result); 
                  // Ou si elle renvoie { user: { ... } } :
                  // if (result.user) setDatas(result.user);
  
                  // Pour l'instant, loggons result pour voir sa structure
                  console.log("Structure de 'result' pour /api/auth/log/:", result);
                  // Si tu es sûr que result.data est la bonne structure, et qu'elle est parfois absente,
                  // tu peux garder setDatas(result.data) mais il faut que l'API soit cohérente.
                  // S'il n'y a pas de 'data', mais que 'result' est l'objet utilisateur, alors:
                  // setDatas(result); // Décommente et ajuste selon la réponse de l'API
  
              } else {
                  console.warn("La réponse JSON est vide ou inattendue.");
                  // setDatas(valeursParDefautOuErreur);
              }
  
          } catch (error) {
              console.log('error fetching logged in user:', error); // Plus descriptif
              // setDatas(valeursParDefautOuErreur);
          } finally {
              // setLoading(false) devrait être appelé directement, pas dans un setTimeout avec la valeur de retour de setLoading(false)
              setLoading(false);
          }
      }
      loadDatas();
  }, [])

    if(datas)     return (
        <>
          {/* User profile picture */}
          <img
            src={UserImage}
            className="rounded-circle user-photo"
            alt="User Profile Picture"
          />
    
          {/* Dropdown menu */}
          <Dropdown>
            <span>Welcome,</span>
            <Dropdown.Toggle
              variant="none"
              as="a"
              id="dropdown-basic"
              className="user-name"
            >
              <strong> {datas.first_name} {datas.last_name} </strong>
            </Dropdown.Toggle>
    
            {/* Dropdown menu items */}
            <Dropdown.Menu className="dropdown-menu-right account">
              {/* default : /profilev2page */}
              <Dropdown.Item href={'/profile/'+datas.id}>
                <i className="icon-user"></i>My Profile
              </Dropdown.Item>
              {/* <Dropdown.Item href="/appinbox">
                {" "}
                <i className="icon-envelope-open"></i>Messages
              </Dropdown.Item> */}
              <Dropdown.Item>
                {" "}
                <i className="icon-settings"></i>Settings
              </Dropdown.Item>
              <li className="divider"></li>
              <Dropdown.Item href={wapp.USER.LOGOUT}>
                {" "}
                <i className="icon-power"></i>Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
    
          {/* Horizontal line */}
          <hr />
    
        </>
      );

      //Loading widget
      return (
          <div className="col">
          <div className="card">
            <div className="body d-flex align-items-center justify-content-center">
              <div className="chart easy-pie-chart-1" data-percent="75">
                {/* Loading Widget */}
                <div className="d-flex align-items-center justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
                {" "}
                <canvas height="10" width="10"></canvas>
              </div>            
            </div>
          </div>
         </div>
              
          )

  }
  

export default UserAccounWidget;