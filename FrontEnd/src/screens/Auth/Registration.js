import React, { useState,useEffect } from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../../assets/images/logo.png";
import LogoWhite from "../../assets/images/logo-white.svg";
import { setCredentials } from "../../actions/RegisterAction";
import axios from 'axios';
import { wServer, wapp } from "../../Data/Consts";


class Registration extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      statusError: false,
      error: 'il y a un probleme',
    }
  }
  

  componentDidMount(){
    document.body.classList.remove("theme-cyan");
    document.body.classList.remove("theme-purple");
    document.body.classList.remove("theme-blue");
    document.body.classList.remove("theme-green");
    document.body.classList.remove("theme-orange");
    document.body.classList.remove("theme-blush");
  }
  handleSubmit = async (event) => {
    event.preventDefault();
    let credentials = {
      email : document.getElementById("signup-email").value,
      password : document.getElementById("signup-password").value
    }
    let confirmPassword = document.getElementById("signup-confirm-password").value
    if(credentials.password === confirmPassword){
      try{
        const response = await axios.post(wServer.REGISTER, credentials);
        if (response.status === 201) {
          // Handle success
            window.location.assign(wapp.USER.LOGIN);
        } else {
          // Handle problem with authentication data
          if (response.data.UserExist) {
            this.setState({error:response.data.UserExist,statusError: true}); // Assuming that user already exists
          }
          if (response.data.NotAllDetail) {
            this.setState({error:response.data.NotAllDetail,statusError: true}); // Assuming that all the information are not provide
          }
          document.getElementById('signupError').classList.toggle("d-none")
        }
      } catch (error) {
            this.setState({error:error.response.data.message,statusError: true}); // Assuming a message is provided in the error response
            document.getElementById('signupError').classList.toggle("d-none")
            console.error("Signup error:", error);
      };
    }else{
      this.setState({ error: "wrong confirm password",statusError: true})
      document.getElementById('signupError').classList.toggle("d-none")

      console.log("Credentials test\n----"+credentials.password+"\n----"+credentials.email);
    }
  }


  render() {
    return (
      <div className="theme-blue">
        <div >
          <div className="vertical-align-wrap">
            <div className="vertical-align-middle auth-main">
              <div className="auth-box">
                <div className="img-responsive logo">
                <img
                  src={
                    document.body.classList.contains("full-dark")
                      ? LogoWhite
                      : Logo
                  }
                  width="200" height="150"
                  alt="Compuclinic"
                  className="img-responsive logo"
                />
                </div>
                <div className="card">
                  <div className="header">
                    <p className="lead">Create an account</p>
                  </div>
                  <div className="body">
                    <form
                      className="form-auth-small ng-untouched ng-pristine ng-valid"
                      
                    >
                      <div className="form-group">
                        <label className="control-label sr-only" >
                          Email
                            </label>
                        <input
                          className="form-control"
                          id="signup-email"
                          placeholder="Your email"
                          type="email"
                        />
                      </div>
                      <div className="form-group">
                        <label className="control-label sr-only" >
                          Password
                            </label>
                        <input
                          className="form-control"
                          id="signup-password"
                          placeholder="Password"
                          type="password"
                        />
                      </div>
                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Confirm Password
                            </label>
                        <input
                          className="form-control"
                          id="signup-confirm-password"
                          placeholder="Confirm Password"
                          type="password"
                        />
                      </div>
                      <button className="btn btn-primary btn-lg btn-block" 
                        type="submit" 
                        onClick={this.handleSubmit}>
                        REGISTER
                      </button>
                      <div className="bottom">
                        <span className="helper-text">
                          Already have an account?{" "}
                          <a href="login">Login</a>
                        </span>
                      </div>
                    </form>
                    <div className="separator-linethrough">
                      <span>OR</span>
                    </div>
                    <button className="btn btn-signin-social">
                      <i className="fa fa-google google-color"></i> Sign in with
                        Google
                        </button>
                    <button className="btn btn-signin-social">
                      <i className="fa fa-github github-color"></i> Sign in with Github
                        </button>
                  
                  </div> 
                  <div id="signupError" className="alert alert-danger mt-3 d-none" role="alert">{this.state.error}</div>

                </div>
               

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Registration.propTypes = {
};

const mapStateToProps = ({ loginReducer }) => ({
  email: loginReducer.email,
  password: loginReducer.password
});

export default connect(mapStateToProps, {
})(Registration);
