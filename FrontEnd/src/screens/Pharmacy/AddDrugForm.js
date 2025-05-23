import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { wServer } from '../../Data/Consts';
import './AddDrugForm.css';

const AddDrugForm = ({ onHide, onDrugAdded }) => {
  const [formData, setFormData] = useState({
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
  });

  const [dosages, setDosages] = useState([
    { fromAge: '', toAge: '', dose: '', frequency: '', duration: '' }
  ]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const dosageForms = [
    'comprimé', 'gélule', 'sirop', 'injectable',
    'pommade', 'crème', 'suppositoire', 'gouttes'
  ];

  const administrationMethods = [
    'oral', 'injectable', 'cutané', 'rectal',
    'vaginal', 'ophtalmique', 'auriculaire'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDosageChange = (index, field, value) => {
    const newDosages = [...dosages];
    newDosages[index] = {
      ...newDosages[index],
      [field]: value
    };
    setDosages(newDosages);
  };

  const addDosageRow = () => {
    setDosages([...dosages, { fromAge: '', toAge: '', dose: '', frequency: '', duration: '' }]);
  };

  const removeDosageRow = (index) => {
    if (dosages.length > 1) {
      setDosages(dosages.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Créer le médicament
      const drugResponse = await axios.post(wServer.POST.PHARMACY.ADD, formData);
      const newDrugId = drugResponse.data.id;

      // Ajouter les posologies si elles existent
      if (dosages.length > 0) {
        const dosagePromises = dosages
          .filter(d => d.fromAge && d.toAge && d.dose) // Ne traiter que les posologies valides
          .map(dosage => 
            axios.post(wServer.POST.PHARMACY.DOSAGE(newDrugId), dosage)
          );

        await Promise.all(dosagePromises);
      }

      setSuccess('Médicament ajouté avec succès');
      setTimeout(() => {
        onDrugAdded();
      }, 1500);
    } catch (error) {
      console.error('Error adding drug:', error);
      setError('Erreur lors de l\'ajout du médicament');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
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
    });
    setDosages([{ fromAge: '', toAge: '', dose: '', frequency: '', duration: '' }]);
    setError('');
    setSuccess('');
  };

  return (
    <>
      <div className="modal-header">
        <h5 className="modal-title">Ajouter un nouveau médicament</h5>
        <button type="button" className="btn-close" onClick={onHide}></button>
      </div>
      <div className="modal-body">
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <div className="form-section">
            <h5>Informations Générales</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom du Médicament*</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom Générique*</Form.Label>
                  <Form.Control
                    type="text"
                    name="genericName"
                    value={formData.genericName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Laboratoire*</Form.Label>
                  <Form.Control
                    type="text"
                    name="laboratory"
                    value={formData.laboratory}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL de la Photo</Form.Label>
                  <Form.Control
                    type="url"
                    name="photoUrl"
                    value={formData.photoUrl}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className="form-section">
            <h5>Forme et Administration</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Forme*</Form.Label>
                  <Form.Select
                    name="dosageForm"
                    value={formData.dosageForm}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Sélectionner une forme</option>
                    {dosageForms.map(form => (
                      <option key={form} value={form}>{form}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Méthode d'Administration*</Form.Label>
                  <Form.Select
                    name="administrationMethod"
                    value={formData.administrationMethod}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Sélectionner une méthode</option>
                    {administrationMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className="form-section">
            <h5>Stock et Prix</h5>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Prix Unitaire (FCFA)*</Form.Label>
                  <Form.Control
                    type="number"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Initial*</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Seuil Minimal*</Form.Label>
                  <Form.Control
                    type="number"
                    name="minStockThreshold"
                    value={formData.minStockThreshold}
                    onChange={handleInputChange}
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
                      <Form.Label>De (ans)</Form.Label>
                      <Form.Control
                        type="number"
                        value={dosage.fromAge}
                        onChange={(e) => handleDosageChange(index, 'fromAge', e.target.value)}
                        required
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>À (ans)</Form.Label>
                      <Form.Control
                        type="number"
                        value={dosage.toAge}
                        onChange={(e) => handleDosageChange(index, 'toAge', e.target.value)}
                        required
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dose (mg)</Form.Label>
                      <Form.Control
                        type="number"
                        value={dosage.dose}
                        onChange={(e) => handleDosageChange(index, 'dose', e.target.value)}
                        required
                        step="0.01"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fréquence</Form.Label>
                      <Form.Control
                        type="text"
                        value={dosage.frequency}
                        onChange={(e) => handleDosageChange(index, 'frequency', e.target.value)}
                        placeholder="ex: 3x/jour"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} className="d-flex align-items-end">
                    <Button
                      variant="outline-danger"
                      className="mb-3"
                      onClick={() => removeDosageRow(index)}
                      disabled={dosages.length === 1}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
            <Button
              variant="outline-primary"
              onClick={addDosageRow}
              className="mb-3"
            >
              + Ajouter une tranche d'âge
            </Button>
          </div>

          <div className="form-section">
            <h5>Informations Additionnelles</h5>
            <Form.Group className="mb-3">
              <Form.Label>Conditions de Conservation</Form.Label>
              <Form.Control
                type="text"
                name="storageCondition"
                value={formData.storageCondition}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Composition</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="composition"
                value={formData.composition}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Commentaires</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
              />
            </Form.Group>
          </div>

          <div className="form-actions">
            <Button variant="secondary" onClick={onHide}>
              Annuler
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Ajout en cours...' : 'Ajouter le médicament'}
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddDrugForm;
