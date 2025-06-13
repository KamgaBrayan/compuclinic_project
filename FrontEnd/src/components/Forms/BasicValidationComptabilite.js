import React from "react";
import { connect } from "react-redux";
// import Select from "react-dropdown-select";
import MedecineImg from "../../assets/images/image-gallery/doc1.jpeg";
import { Link } from "react-router-dom";

class Comptabilite extends React.Component {
  render()
   {
    const {title, role, image, link} = this.props;
    return (
      <div className="col-md-4">
        <div className="card">
          <div className="header">
            <h2>{title||'Department'}</h2>
          </div>
          <div>
              <img className="d-block img-fluid" src={image?image:MedecineImg} alt=""/>
          </div>
          <div className="header d-flex justify-content-between align-items-center"> 
            <h2>{role || 'Secretaire'}</h2>
            <div className="headerright btn-group-sm">
              <Link to={link||'#'} type="button" className="btn btn-outline-primary mr-1">
                  More
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer }) => ({});

export default connect(mapStateToProps, {})(Comptabilite);
