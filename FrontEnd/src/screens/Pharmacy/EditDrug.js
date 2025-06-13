import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Row, Col, Alert, Card, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';

import { wServer } from '../../Data/Consts';
import PageHeader from '../../components/PageHeader';
import './AddDrug.css'; // Reusing the same CSS for a consistent look

class EditDrug extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        type: 'drug',
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
      dosages: [],
      error: '',
      success: '',
      loading: true, // Start with loading true to fetch data
      saving: false,
    };

    // Constants for form dropdowns
    this.dosageForms = ['tablet', 'capsule', 'syrup', 'injectable', 'powder', 'pastille', 'cream', 'drop', 'inhaler', 'suppository', 'spray'];
    this.administrationMethods = ['oral', 'rectal', 'vaginal', 'intravenous', 'cutaneous', 'ocular', 'auricular'];
    this.storageConditions = ['roomTemperature', 'refrigerated', 'frozen'];
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchDrugData();
  }

  fetchDrugData = async () => {
    const { drugId } = this.props.match.params;
    if (!drugId) {
      this.setState({ loading: false, error: "No item ID provided." });
      return;
    }

    try {
      const response = await axios.get(wServer.GET.PHARMACY.BY_ID(drugId));
      const drugData = response.data.drug;
      this.setState({
        formData: {
          type: drugData.type || 'drug',
          name: drugData.name || '',
          genericName: drugData.genericName || '',
          laboratory: drugData.laboratory || '',
          dosageForm: drugData.dosageForm || 'tablet',
          administrationMethod: drugData.administrationMethod || 'oral',
          unitPrice: drugData.unitPrice || '',
          stock: drugData.stock || '',
          minStockThreshold: drugData.minStockThreshold || '',
          storageCondition: drugData.storageCondition || 'roomTemperature',
          composition: drugData.composition || '',
          comment: drugData.comment || '',
          photoUrl: drugData.photoUrl || ''
        },
        dosages: drugData.DrugDosages || [{ fromAge: '', toAge: '', dose: '' }],
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching item data:", error);
      this.setState({ loading: false, error: "Failed to load item data." });
    }
  };

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
    this.setState({ saving: true, error: '', success: '' });
    const { drugId } = this.props.match.params;

    try {
      const itemData = {
        ...this.state.formData,
        unitPrice: parseFloat(this.state.formData.unitPrice),
        stock: parseInt(this.state.formData.stock),
        minStockThreshold: parseInt(this.state.formData.minStockThreshold)
      };

      await axios.put(wServer.ACTION_POST.UPDATE.PHARMACY.DRUG(drugId), itemData);

      this.setState({ success: 'Item updated successfully! Redirecting...' });
      setTimeout(() => {
        this.props.history.push('/pharmacy');
      }, 2000);

    } catch (error) {
      console.error('Error updating item:', error.response?.data || error);
      this.setState({
        error: error.response?.data?.message || 'Error updating item. Please check the fields.'
      });
    } finally {
      this.setState({ saving: false });
    }
  };

  render() {
    const { formData, dosages, error, success, loading, saving } = this.state;
    const { history } = this.props;

    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }

    return (
      <div style={{ flex: 1 }}>
        <div className="container-fluid">
          <PageHeader
            HeaderText={`Edit ${formData.type === 'drug' ? 'Drug' : 'Equipment'}`}
            Breadcrumb={[{ name: "Inventory", navigate: "/pharmacy" }, { name: "Edit Item" }]}
          />
          <Container className="add-drug-container">
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={this.handleSubmit} className="add-drug-form">
              <Card className="mb-4">
                <Card.Header><h5>{`Editing: ${formData.name}`}</h5></Card.Header>
                <Card.Body>
                  <Alert variant="info">
                    You are currently editing an item of type: <strong>{formData.type}</strong>. The type cannot be changed.
                  </Alert>
                </Card.Body>
              </Card>

              {/* ... (The rest of the form structure is identical to AddDrug.js, just with pre-filled values) ... */}
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

              {formData.type === 'drug' && (
                <Card className="mb-4">
                  <Card.Header><h5>Drug Specifics</h5></Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}><Form.Group className="mb-3"><Form.Label>Form *</Form.Label><Form.Control as="select" name="dosageForm" value={formData.dosageForm} onChange={this.handleInputChange} required>{this.dosageForms.map(form => <option key={form} value={form}>{form}</option>)}</Form.Control></Form.Group></Col>
                      <Col md={6}><Form.Group className="mb-3"><Form.Label>Administration *</Form.Label><Form.Control as="select" name="administrationMethod" value={formData.administrationMethod} onChange={this.handleInputChange} required >{this.administrationMethods.map(method => <option key={method} value={method}>{method}</option>)}</Form.Control></Form.Group></Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}

              <Card className="mb-4">
                <Card.Header><h5>Stock & Price Details</h5></Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}><Form.Group className="mb-3"><Form.Label>Unit Price (FCFA) *</Form.Label><Form.Control type="decimal" name="unitPrice" value={formData.unitPrice} onChange={this.handleInputChange} required min="0" /></Form.Group></Col>
                    <Col md={4}><Form.Group className="mb-3"><Form.Label>Current Stock *</Form.Label><Form.Control type="number" name="stock" value={formData.stock} onChange={this.handleInputChange} required min="0" /></Form.Group></Col>
                    <Col md={4}><Form.Group className="mb-3"><Form.Label>Minimum Threshold *</Form.Label><Form.Control type="number" name="minStockThreshold" value={formData.minStockThreshold} onChange={this.handleInputChange} required min="0" /></Form.Group></Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Dosage section is intentionally omitted from the edit screen for simplicity. It can be added back if needed. */}

              <Card className="mb-4">
                <Card.Header><h5>Additional Information</h5></Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Storage Condition</Form.Label><Form.Control as="select" name="storageCondition" value={formData.storageCondition} onChange={this.handleInputChange}>{this.storageConditions.map(cond => <option key={cond} value={cond}>{cond.replace(/([A-Z])/g, ' $1').trim()}</option>)}</Form.Control></Form.Group></Col>
                    {formData.type === 'drug' && <Col md={6}><Form.Group className="mb-3"><Form.Label>Composition</Form.Label><Form.Control as="textarea" rows={2} name="composition" value={formData.composition} onChange={this.handleInputChange} /></Form.Group></Col>}
                    <Col md={12}><Form.Group className="mb-3"><Form.Label>Comments</Form.Label><Form.Control as="textarea" rows={2} name="comment" value={formData.comment} onChange={this.handleInputChange} /></Form.Group></Col>
                  </Row>
                </Card.Body>
              </Card>

              <div className="form-actions">
                <Button variant="secondary" onClick={() => history.push('/pharmacy')} disabled={saving}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={saving}>
                  {saving ? <><i className="fas fa-spinner fa-spin"></i> Saving Changes...</> : <><FontAwesomeIcon icon={faSave} /> Save Changes</>}
                </Button>
              </div>
            </Form>
          </Container>
        </div>
      </div>
    );
  }
}

export default withRouter(EditDrug);
