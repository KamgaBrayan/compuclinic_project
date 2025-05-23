import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { wServer } from '../../Data/Consts';
import NavbarMenu from '../../components/NavbarMenu';
import './AddDrug.css';

class AddDrug extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        name: '',
        genericName: '',
        laboratory: '',
        dosageForm: '',
        administrationMethod: '',
        unitPrice: '',
        stock: '',
        minStockThreshold: '',
        storageCondition: '',
        composition: '',
        comment: '',
        photoUrl: ''
      },
      dosages: [
        { fromAge: '', toAge: '', dose: '', frequency: '', duration: '' }
      ],
      error: '',
      success: '',
      loading: false
    };

    this.dosageForms = [
      'comprimé', 'gélule', 'sirop', 'injectable',
      'pommade', 'crème', 'suppositoire', 'gouttes',
      'patch', 'spray', 'solution'
    ];

    this.administrationMethods = [
      'oral', 'injectable', 'cutané', 'rectal',
      'vaginal', 'ophtalmique', 'auriculaire', 'nasal'
    ];
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }));
  };

  handleDosageChange = (index, field, value) => {
    this.setState(prevState => {
      const newDosages = [...prevState.dosages];
      newDosages[index] = {
        ...newDosages[index],
        [field]: value
      };
      return { dosages: newDosages };
    });
  };

  addDosageRow = () => {
    this.setState(prevState => ({
      dosages: [...prevState.dosages, { fromAge: '', toAge: '', dose: '', frequency: '', duration: '' }]
    }));
  };

  removeDosageRow = (index) => {
    if (this.state.dosages.length > 1) {
      this.setState(prevState => ({
        dosages: prevState.dosages.filter((_, i) => i !== index)
      }));
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, error: '', success: '' });

    try {
      // Préparer les données du médicament
      const drugData = {
        ...this.state.formData,
        unitPrice: parseFloat(this.state.formData.unitPrice),
        stock: parseInt(this.state.formData.stock),
        minStockThreshold: parseInt(this.state.formData.minStockThreshold)
      };

      // Créer le médicament
      const drugResponse = await axios.post(wServer.POST.PHARMACY.ADD, drugData);
      const newDrugId = drugResponse.data.id;

      // Ajouter les posologies si elles existent
      if (this.state.dosages.length > 0) {
        const dosagePromises = this.state.dosages
          .filter(d => d.fromAge && d.toAge && d.dose)
          .map(dosage => ({
            ...dosage,
            fromAge: parseInt(dosage.fromAge),
            toAge: parseInt(dosage.toAge),
            dose: parseFloat(dosage.dose)
          }))
          .map(dosage => 
            axios.post(wServer.POST.PHARMACY.DOSAGE(newDrugId), dosage)
          );

        await Promise.all(dosagePromises);
      }

      this.setState({ success: 'Médicament ajouté avec succès' });
      setTimeout(() => {
        this.props.history.push('/pharmacy');
      }, 1500);
    } catch (error) {
      console.error('Error adding drug:', error);
      this.setState({ 
        error: error.response?.data?.message || 'Erreur lors de l\'ajout du médicament'
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { formData, dosages, error, success, loading } = this.state;
    const { history } = this.props;

    return (
      <React.Fragment>
        <NavbarMenu />
        <div className="main-container">
          <Container className="add-drug-container">
            <div className="page-header">
              <h2>Ajouter un nouveau médicament</h2>
              <Button 
                variant="outline-primary" 
                className="back-button"
                onClick={() => history.push('/pharmacy')}
              >
                <i className="fas fa-arrow-left"></i> Retour à la pharmacie
              </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={this.handleSubmit} className="add-drug-form">
              <div className="form-section">
                <h5>Informations Générales</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom du médicament *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={this.handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom générique</Form.Label>
                      <Form.Control
                        type="text"
                        name="genericName"
                        value={formData.genericName}
                        onChange={this.handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Laboratoire *</Form.Label>
                      <Form.Control
                        type="text"
                        name="laboratory"
                        value={formData.laboratory}
                        onChange={this.handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Forme galénique *</Form.Label>
                      <Form.Select
                        name="dosageForm"
                        value={formData.dosageForm}
                        onChange={this.handleInputChange}
                        required
                      >
                        <option value="">Sélectionner une forme</option>
                        {this.dosageForms.map(form => (
                          <option key={form} value={form}>{form}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="form-section">
                <h5>Administration et Stock</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Voie d'administration *</Form.Label>
                      <Form.Select
                        name="administrationMethod"
                        value={formData.administrationMethod}
                        onChange={this.handleInputChange}
                        required
                      >
                        <option value="">Sélectionner une voie</option>
                        {this.administrationMethods.map(method => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Prix unitaire (FCFA) *</Form.Label>
                      <Form.Control
                        type="number"
                        name="unitPrice"
                        value={formData.unitPrice}
                        onChange={this.handleInputChange}
                        required
                        min="0"
                        step="0.01"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Stock actuel *</Form.Label>
                      <Form.Control
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={this.handleInputChange}
                        required
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Seuil minimal *</Form.Label>
                      <Form.Control
                        type="number"
                        name="minStockThreshold"
                        value={formData.minStockThreshold}
                        onChange={this.handleInputChange}
                        required
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="form-section">
                <h5>Posologie</h5>
                {dosages.map((dosage, index) => (
                  <div key={index} className="dosage-row">
                    <Row>
                      <Col md={2}>
                        <Form.Group className="mb-3">
                          <Form.Label>Âge min</Form.Label>
                          <Form.Control
                            type="number"
                            value={dosage.fromAge}
                            onChange={(e) => this.handleDosageChange(index, 'fromAge', e.target.value)}
                            min="0"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group className="mb-3">
                          <Form.Label>Âge max</Form.Label>
                          <Form.Control
                            type="number"
                            value={dosage.toAge}
                            onChange={(e) => this.handleDosageChange(index, 'toAge', e.target.value)}
                            min="0"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group className="mb-3">
                          <Form.Label>Dose (mg)</Form.Label>
                          <Form.Control
                            type="number"
                            value={dosage.dose}
                            onChange={(e) => this.handleDosageChange(index, 'dose', e.target.value)}
                            min="0"
                            step="0.1"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Fréquence</Form.Label>
                          <Form.Control
                            type="text"
                            value={dosage.frequency}
                            onChange={(e) => this.handleDosageChange(index, 'frequency', e.target.value)}
                            placeholder="ex: 3 fois/jour"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Durée</Form.Label>
                          <Form.Control
                            type="text"
                            value={dosage.duration}
                            onChange={(e) => this.handleDosageChange(index, 'duration', e.target.value)}
                            placeholder="ex: 7 jours"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    {dosages.length > 1 && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => this.removeDosageRow(index)}
                        className="remove-dosage-btn"
                      >
                        <i className="fas fa-trash"></i> Supprimer
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline-primary"
                  onClick={this.addDosageRow}
                  className="add-dosage-btn"
                >
                  <i className="fas fa-plus"></i> Ajouter une posologie
                </Button>
              </div>

              <div className="form-section">
                <h5>Informations Complémentaires</h5>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Conditions de stockage</Form.Label>
                      <Form.Control
                        type="text"
                        name="storageCondition"
                        value={formData.storageCondition}
                        onChange={this.handleInputChange}
                        placeholder="ex: Conserver à température ambiante"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Composition</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="composition"
                        value={formData.composition}
                        onChange={this.handleInputChange}
                        placeholder="Détaillez la composition du médicament"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Commentaires</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="comment"
                        value={formData.comment}
                        onChange={this.handleInputChange}
                        placeholder="Ajoutez des remarques ou précautions particulières"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="form-actions">
                <Button 
                  variant="secondary" 
                  onClick={() => history.push('/pharmacy')}
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Enregistrement...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i> Enregistrer
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(AddDrug);
