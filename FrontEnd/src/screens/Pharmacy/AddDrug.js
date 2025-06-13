import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';

import { wServer } from '../../Data/Consts';
import PageHeader from '../../components/PageHeader';
import './AddDrug.css';

class AddDrug extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        type: 'drug', // **NEW: Default to 'drug'**
        name: '',
        genericName: '',
        laboratory: '',
        dosageForm: 'tablet',
        administrationMethod: 'oral',
        unitPrice: '',
        stock: '',
        minStockThreshold: '',
        storageCondition: 'roomTemperature',
        composition: '',
        comment: '',
        photoUrl: ''
      },
      dosages: [
        { fromAge: '', toAge: '', dose: '' }
      ],
      error: '',
      success: '',
      loading: false
    };

    this.dosageForms = ['tablet', 'capsule', 'syrup', 'injectable', 'powder', 'pastille', 'cream', 'drop', 'inhaler', 'suppository', 'spray'];
    this.administrationMethods = ['oral', 'rectal', 'vaginal', 'intravenous', 'cutaneous', 'ocular', 'auricular'];
    this.storageConditions = ['roomTemperature', 'refrigerated', 'frozen'];
  }

  componentDidMount() {
    window.scrollTo(0, 0);
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
      newDosages[index] = { ...newDosages[index], [field]: value };
      return { dosages: newDosages };
    });
  };

  addDosageRow = () => {
    this.setState(prevState => ({
      dosages: [...prevState.dosages, { fromAge: '', toAge: '', dose: '' }]
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
      const drugData = {
        ...this.state.formData,
        unitPrice: parseFloat(this.state.formData.unitPrice),
        stock: parseInt(this.state.formData.stock),
        minStockThreshold: parseInt(this.state.formData.minStockThreshold)
      };
      const validDosages = this.state.dosages.filter(d => d.fromAge && d.toAge && d.dose);

      const response = await axios.post(wServer.CREATE.PHARMACY.DRUG, drugData);
      const newItemId = response.data.drug.id;

      if (newItemId && drugData.type === 'drug' && validDosages.length > 0) {
        const dosagePromises = validDosages.map(dosage =>
          axios.post(wServer.CREATE.PHARMACY.DOSAGE(newItemId), { ...dosage })
        );
        await Promise.all(dosagePromises);
      }

      this.setState({ success: 'Item added successfully! Redirecting...' });
      setTimeout(() => {
        this.props.history.push('/pharmacy');
      }, 2000);

    } catch (error) {
      console.error('Error adding item:', error.response?.data || error);
      this.setState({
        error: error.response?.data?.message || 'Error adding item. Please check the fields.'
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { formData, dosages, error, success, loading } = this.state;
    const { history } = this.props;

    return (
      <div style={{ flex: 1 }}>
        <div className="container-fluid">
          <PageHeader HeaderText="Add New Inventory Item" Breadcrumb={[{ name: "Inventory", navigate: "/pharmacy" }, { name: "Add Item" }]} />
          <Container className="add-drug-container">
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={this.handleSubmit} className="add-drug-form">

              <Card className="mb-4">
                <Card.Header><h5>Item Type</h5></Card.Header>
                <Card.Body>
                  <Form.Group>
                    <div className="d-flex gap-3">
                      <Form.Check type="radio" id="type-drug" name="type" label="Drug" value="drug" checked={formData.type === 'drug'} onChange={this.handleInputChange} />
                      <Form.Check type="radio" id="type-equipment" name="type" label="Equipment" value="equipment" checked={formData.type === 'equipment'} onChange={this.handleInputChange} />
                    </div>
                  </Form.Group>
                </Card.Body>
              </Card>

              <Card className="mb-4">
                <Card.Header><h5>General Information</h5></Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}><Form.Group className="mb-3"><Form.Label>{formData.type === 'drug' ? 'Drug Name' : 'Equipment Name'} *</Form.Label><Form.Control type="text" name="name" value={formData.name} onChange={this.handleInputChange} required /></Form.Group></Col>
                    {formData.type === 'drug' ? (
                      <>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Generic Name *</Form.Label><Form.Control type="text" name="genericName" value={formData.genericName} onChange={this.handleInputChange} required /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Laboratory *</Form.Label><Form.Control type="text" name="laboratory" value={formData.laboratory} onChange={this.handleInputChange} required /></Form.Group></Col>
                      </>
                    ) : (
                      <Col md={6}><Form.Group className="mb-3"><Form.Label>Manufacturer</Form.Label><Form.Control type="text" name="laboratory" value={formData.laboratory} onChange={this.handleInputChange} /></Form.Group></Col>
                    )}
                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Photo URL</Form.Label><Form.Control type="url" name="photoUrl" value={formData.photoUrl} onChange={this.handleInputChange} /></Form.Group></Col>
                  </Row>
                </Card.Body>
              </Card>

              {formData.type === 'drug' &&
                <Card className="mb-4">
                  <Card.Header><h5>Form, Administration & Price</h5></Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={4}><Form.Group className="mb-3"><Form.Label>Form *</Form.Label><Form.Control as="select" name="dosageForm" value={formData.dosageForm} onChange={this.handleInputChange} required>{this.dosageForms.map(form => <option key={form} value={form}>{form}</option>)}</Form.Control></Form.Group></Col>
                      <Col md={4}><Form.Group className="mb-3"><Form.Label>Administration *</Form.Label><Form.Control as="select" name="administrationMethod" value={formData.administrationMethod} onChange={this.handleInputChange} required >{this.administrationMethods.map(method => <option key={method} value={method}>{method}</option>)}</Form.Control></Form.Group></Col>
                      <Col md={4}><Form.Group className="mb-3"><Form.Label>Unit Price (FCFA) *</Form.Label><Form.Control type="number" name="unitPrice" value={formData.unitPrice} onChange={this.handleInputChange} required min="0" /></Form.Group></Col>
                    </Row>
                  </Card.Body>
                </Card>
              }

              <Card className="mb-4">
                <Card.Header><h5>Stock & Storage</h5></Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}><Form.Group className="mb-3"><Form.Label>Current Stock *</Form.Label><Form.Control type="number" name="stock" value={formData.stock} onChange={this.handleInputChange} required min="0" /></Form.Group></Col>
                    <Col md={4}><Form.Group className="mb-3"><Form.Label>Minimum Threshold *</Form.Label><Form.Control type="number" name="minStockThreshold" value={formData.minStockThreshold} onChange={this.handleInputChange} required min="0" /></Form.Group></Col>
                    <Col md={4}><Form.Group className="mb-3"><Form.Label>Storage Condition *</Form.Label><Form.Control as="select" name="storageCondition" value={formData.storageCondition} onChange={this.handleInputChange} required >{this.storageConditions.map(cond => <option key={cond} value={cond}>{cond.replace(/([A-Z])/g, ' $1').trim()}</option>)}</Form.Control></Form.Group></Col>
                  </Row>
                </Card.Body>
              </Card>

              {formData.type === 'drug' &&
                <Card className="mb-4">
                  <Card.Header><h5>Dosage</h5></Card.Header>
                  <Card.Body>
                    {dosages.map((dosage, index) => (
                      <div key={index} className="dosage-row"><Row className="align-items-end"><Col md={3}><Form.Group><Form.Label>From Age</Form.Label><Form.Control type="number" value={dosage.fromAge} onChange={(e) => this.handleDosageChange(index, 'fromAge', e.target.value)} min="0" /></Form.Group></Col><Col md={3}><Form.Group><Form.Label>To Age</Form.Label><Form.Control type="number" value={dosage.toAge} onChange={(e) => this.handleDosageChange(index, 'toAge', e.target.value)} min="0" /></Form.Group></Col><Col md={4}><Form.Group><Form.Label>Dose (mg)</Form.Label><Form.Control type="number" value={dosage.dose} onChange={(e) => this.handleDosageChange(index, 'dose', e.target.value)} min="0" step="0.1" /></Form.Group></Col><Col md={2} className="text-center"><Button variant="outline-danger" className="remove-dosage-btn" onClick={() => this.removeDosageRow(index)} disabled={dosages.length === 1}><FontAwesomeIcon icon={faTrash} /></Button></Col></Row></div>
                    ))}
                    <Button variant="outline-primary" onClick={this.addDosageRow} className="add-dosage-btn mt-3"><FontAwesomeIcon icon={faPlus} /> Add Dosage</Button>
                  </Card.Body>
                </Card>
              }

              <Card className="mb-4">
                <Card.Header><h5>Additional Information</h5></Card.Header>
                <Card.Body>
                  <Row>
                    {formData.type === 'drug' && <Col md={12}><Form.Group className="mb-3"><Form.Label>Composition</Form.Label><Form.Control as="textarea" rows={2} name="composition" value={formData.composition} onChange={this.handleInputChange} /></Form.Group></Col>}
                    <Col md={12}><Form.Group className="mb-3"><Form.Label>Comments</Form.Label><Form.Control as="textarea" rows={2} name="comment" value={formData.comment} onChange={this.handleInputChange} /></Form.Group></Col>
                  </Row>
                </Card.Body>
              </Card>

              <div className="form-actions">
                <Button variant="secondary" onClick={() => history.push('/pharmacy')} disabled={loading}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><FontAwesomeIcon icon={faSave} /> Save Item</>}
                </Button>
              </div>
            </Form>
          </Container>
        </div>
      </div>
    );
  }
}

export default withRouter(AddDrug);
