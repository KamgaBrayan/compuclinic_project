import { wServer, wapp } from "../Data/Consts";
import axios from 'axios';

// export const setCredentials = (cred) => {
//   let formQuery = {email: cred.email, password: cred.password}

//   console.log(formQuery);
//   fetch(wServer.REGISTER, {
//     method: 'post',
//     body: formQuery, //cred
//   }).then(response => {
//     console.log("--1"+response.json());
//     if (response.status === 201) { return response.json() }
//     else {
//       console.log("--2"+response.json());
//       //document.getElementById('loginError').classList.toggle("d-none")
//     }
//   }).then(result => {

//     //reach the dashboard
//     //window.location.assign(wapp.USER.LOGIN)
//   })
// }


export const setCredentials = (cred) => {
  let formQuery = {
    email: cred.email,
    password: cred.password
  };

  console.log(formQuery);

  axios.post(wServer.REGISTER, formQuery)
    .then(response => {
      console.log("--1", response.data); // Axios response.data contains the parsed JSON response
      if (response.status === 201) {
        // Handle success
        console.log("--1", response.data);
        // Example: redirect to dashboard
        window.location.assign(wapp.USER.LOGIN);
      } else {
        console.log("--2", response.data); // Handle other status codes or errors

      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle error
    });
};

