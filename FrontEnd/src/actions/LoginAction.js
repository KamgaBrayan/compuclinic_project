import { wServer, wapp } from "../Data/Consts";
import axios from 'axios';

export const UPDATE_EMAIL = "loginReducer/UPDATE_EMAIL";
export const UPDATE_PASSWORD = "loginReducer/UPDATE_PASSWORD";
export const ON_LOGGEDIN = "loginReducer/ON_LOGGEDIN";

export const updateEmail = (val) => (disptch) => {
  disptch({
    type: UPDATE_EMAIL,
    payload: val,
  });
};

export const updatePassword = (val) => (disptch) => {
  disptch({
    type: UPDATE_PASSWORD,
    payload: val,
  });
};

export const onLoggedin = (val) => (disptch) => {
  disptch({
    type: ON_LOGGEDIN,
    payload: val,
  });
};

export const checkLoginStatus = () => {
  // Check if user is already logged in
  console.log(window.location.pathname)
  if (window.localStorage.getItem('_compuclinicToken') && window.localStorage.getItem('_compuclinicToken')!==null){
    if(window.location.pathname === '/' || window.location.pathname === '/login') window.location.assign('/dashboard')
  } else if(window.location.pathname !== '/login') window.location.assign('/login')
}
export const checkCredentials = (cred) => {
  let formQuery = {
    email: cred.email,
    password: cred.password
  };

  console.log(formQuery);

  axios.post(wServer.LOGIN,formQuery)
  .then(response => {
    if (response.status === 200) { 
      storeToken(response.data.token)
      window.location.assign(wapp.DASHBOARD) }
    else {
      document.getElementById('loginError').classList.toggle("d-none")
    }
  })
}

export const storeToken = (uat) =>{
 //uat = user access token
//  localStorage.setItem('_compuclinicToken', uat.access);
 localStorage.setItem('_compuclinicToken', uat);
 console.log(uat)
//  localStorage.setItem('_compuclinicToken', JSON.stringify(uat));
}

export const logOut = () => {
  //free up sessionStorage field _compuclinicToken
  localStorage.setItem('_compuclinicToken', null);
}
