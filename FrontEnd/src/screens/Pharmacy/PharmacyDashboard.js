import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Nav, Tab, Modal, Badge, Button, Container, Form, InputGroup } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { wServer } from '../../Data/Consts';
import './PharmacyDashboard.css';

// Import des composants
import CartModal from './components/CartModal';
import InvoiceForm from './components/InvoiceForm';

// Composant pour afficher les dosages par âge
const DosageInfo = ({ dosages }) => {
  return (
    <div className="dosage-info">
      {dosages && dosages.map((dosage, index) => (
        <div key={index} className="dosage-item">
          <Badge bg="info">
            {dosage.fromAge} - {dosage.toAge} years
          </Badge>
          <span className="dosage-value">{dosage.dose} mg</span>
        </div>
      ))}
    </div>
  );
};

// Modal de détails du médicament
const DrugDetailsModal = ({ drug, show, onHide, onAddToCart }) => {
  const [dosages, setDosages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchDosages = async () => {
      if (drug && show) {
        try {
          setLoading(true);
          setError(null);
          console.log('Fetching dosages for drug:', drug.id);
          const response = await axios.get(wServer.GET.PHARMACY.DOSAGE(drug.id));
          console.log('Dosages response:', response.data);
          setDosages(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          console.error('Error fetching dosages:', error);
          setError('Error loading dosages');
          setDosages([]);
        } finally {
          setLoading(false);
        }
      }
    };

    if (show) {
      setQuantity(1);
      fetchDosages();
    }
  }, [drug, show]);

  const handleAddToCart = () => {
    onAddToCart(drug, quantity);
    onHide();
  };

  if (!drug) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="drug-details-modal">
      <Modal.Header closeButton>
        <Modal.Title>{drug.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={4}>
            <img 
              src={drug.photoUrl || '/assets/images/default-medicine.jpg'} 
              alt={drug.name}
              className="detail-image"
            />
          </Col>
          <Col md={8}>
            <div className="drug-details-content">
              <div className="detail-section">
                <h5>General Information</h5>
                <p><strong>Generic Name:</strong> <span className="generic-name">{drug.genericName}</span></p>
                <p><strong>Laboratory:</strong> <span className="laboratory">{drug.laboratory}</span></p>
                <p><strong>Unitary price:</strong> <span className="price">{drug.unitPrice} FCFA</span></p>
              </div>

              <div className="detail-section">
                <h5>Stock Management</h5>
                <div className="stock-info">
                  <div className="stock-level">
                    <span className="stock-count">{drug.stock}</span>
                    <span className="stock-label">unit in stock</span>
                  </div>
                  <div className="stock-threshold">
                    <span className="threshold-count">{drug.minStockThreshold}</span>
                    <span className="threshold-label">minimum threshold</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h5>Administration</h5>
                <p><strong>Form:</strong> <Badge bg="primary">{drug.dosageForm}</Badge></p>
                <p><strong>Method:</strong> <Badge bg="secondary">{drug.administrationMethod}</Badge></p>
                <p><strong>Conservation:</strong> <Badge bg="info">{drug.storageCondition}</Badge></p>
              </div>

              <div className="detail-section">
                <h5>Dosage by Age</h5>
                {loading ? (
                  <div className="loading-dosages">Dosages loading...</div>
                ) : error ? (
                  <div className="error-message">{error}</div>
                ) : dosages.length === 0 ? (
                  <div className="no-dosages">No Dosage defined</div>
                ) : (
                  <div className="dosages-list">
                    {dosages.map((dosage, index) => (
                      <div key={index} className="dosage-item">
                        <div className="age-range">
                          <Badge bg="info">{dosage.fromAge} - {dosage.toAge} years</Badge>
                        </div>
                        <div className="dosage-details">
                          <span className="dose">{dosage.dose} mg</span>
                          <span className="frequency">{dosage.frequency}</span>
                          {dosage.duration && (
                            <span className="duration">for {dosage.duration}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {drug.composition && (
                <div className="detail-section">
                  <h5>Composition</h5>
                  <p>{drug.composition}</p>
                </div>
              )}

              {drug.comment && (
                <div className="detail-section">
                  <h5>Comment</h5>
                  <p>{drug.comment}</p>
                </div>
              )}

              <div className="add-to-cart-section">
                <div className="quantity-selector">
                  <Button
                    variant="outline-secondary"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="quantity-display">{quantity}</span>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setQuantity(Math.min(drug.stock, quantity + 1))}
                    disabled={quantity >= drug.stock}
                  >
                    +
                  </Button>
                </div>
                <Button
                  variant="primary"
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={drug.stock === 0}
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                  Add to cart
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

// Carte de médicament simplifiée
const DrugCard = ({ drug, onViewDetails }) => {
  return (
    <Card className="drug-card" onClick={onViewDetails}>
      <div className="card-image-container">
        <Card.Img 
          variant="top" 
          src={drug.photoUrl || 'https://www.universityofcalifornia.edu/sites/default/files/generic-drugs-istock.jpg'} 
          className="drug-image"
        />
        {drug.stock <= drug.minStockThreshold && (
          <div className="stock-alert-badge">
            Low Stock
          </div>
        )}
      </div>
      <Card.Body>
        <Card.Title>{drug.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{drug.genericName}</Card.Subtitle>
        <div className="drug-quick-info">
          <div className="info-item stock">
            <span className="label">Stock</span>
            <span className="value">{drug.stock}</span>
          </div>
          <div className="info-item price">
            <span className="label">Price</span>
            <span className="value">{drug.unitPrice} FCFA</span>
          </div>
        </div>
        <div className="drug-badges">
          <Badge bg="primary" className="form-badge">{drug.dosageForm}</Badge>
          <Badge bg="info" className="admin-badge">{drug.administrationMethod}</Badge>
        </div>
      </Card.Body>
    </Card>
  );
};

const PharmacyDashboard = ({ history }) => {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('dosage');
  const [activeSubCategory, setActiveSubCategory] = useState('');
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);

  const dosageForms = [
    'tablet', 'capsule', 'syrup', 'injectable',
  ];
  const administrationMethods = [
    'cutaneous', 'ocular', 'auricular'
  ];

  const fetchDrugs = async (query = '') => {
    try {
      setLoading(true);
      setError(null);
      const url = query 
        ? `${wServer.GET.PHARMACY.SEARCH}?field=name&query=${encodeURIComponent(query)}`
        : wServer.GET.PHARMACY.ALL;
      
      console.log('Fetching drugs from:', url);
      const response = await axios.get(url);
      console.log('API Response:', response.data);
      
      // Assurez-vous que nous avons un tableau
      const drugsData = Array.isArray(response.data) ? response.data : 
                       response.data.drugs ? response.data.drugs : [];
      
      setDrugs(drugsData);
    } catch (err) {
      console.error('Error fetching drugs:', err);
      setError('Error loading drugs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      await fetchDrugs();
      return;
    }
    await fetchDrugs(searchQuery.trim());
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getSubCategories = () => {
    if (!Array.isArray(drugs)) {
      return [];
    }

    switch (activeCategory) {
      case 'dosage':
        return dosageForms;
      case 'administration':
        return administrationMethods;
      case 'laboratory':
        return [...new Set(drugs
          .map(drug => drug.laboratory)
          .filter(lab => lab != null && lab !== '')
        )];
      default:
        return [];
    }
  };

  const filterDrugs = () => {
    if (!Array.isArray(drugs)) {
      console.warn('drugs is not an array:', drugs);
      return [];
    }

    let filtered = [...drugs];

    if (activeCategory && activeSubCategory) {
      filtered = filtered.filter(drug => {
        switch (activeCategory) {
          case 'dosage':
            return drug.dosageForm === activeSubCategory;
          case 'administration':
            return drug.administrationMethod === activeSubCategory;
          case 'laboratory':
            return drug.laboratory === activeSubCategory;
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const filteredDrugs = filterDrugs();

  if (!Array.isArray(filteredDrugs)) {
    console.error('filteredDrugs is not an array:', filteredDrugs);
    return <div>Erreur: Format de données incorrect</div>;
  }

  const handleAddToCart = (drug, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === drug.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === drug.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...drug, quantity }];
    });

    // Animation de l'icône du panier
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
      cartIcon.classList.add('cart-animation');
      setTimeout(() => cartIcon.classList.remove('cart-animation'), 300);
    }
  };

  const handleUpdateQuantity = (drugId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === drugId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveFromCart = (drugId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== drugId));
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      setShowCartModal(false);
      setShowInvoiceForm(true);
    }
  };

  const handleCreateInvoice = async (invoiceData) => {
    try {
      const finalInvoiceData = {
        ...invoiceData,
        items: cartItems,
        total: calculateTotal()
      };
      
      setCurrentInvoice(finalInvoiceData);
      setShowInvoiceForm(false);
      setShowInvoicePreview(true);
      
      // Vider le panier seulement après confirmation de la facture
      // setCartItems([]);
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const handleCloseInvoice = () => {
    setShowInvoicePreview(false);
    setCurrentInvoice(null);
    setCartItems([]); // Vider le panier après la fermeture de la facture
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  return (
    <Container fluid className="pharmacy-dashboard">
      <Row className="mb-4">
        <Col>
          <h2>Drugs Management</h2>
        </Col>
      </Row>

      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <Nav variant="tabs" activeKey={activeCategory} onSelect={setActiveCategory}>
            <Nav.Item>
              <Nav.Link eventKey="dosage">Dosage</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="administration">Administration</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="laboratory">Laboratory</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col md={6}>
          <div className="d-flex align-items-center gap-2">
            <Form onSubmit={handleSearch} className="search-bar flex-grow-1">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Rechercher un médicament..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <Button variant="outline-secondary" type="submit">
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </InputGroup>
            </Form>
            <Button
              variant="outline-primary"
              className="cart-button"
              onClick={() => setShowCartModal(true)}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
              {cartItems.length > 0 && (
                <Badge bg="primary" pill className="cart-badge">
                  {cartItems.length}
                </Badge>
              )}
            </Button>
            <Button
              variant="primary"
              onClick={() => history.push(`${process.env.PUBLIC_URL}/addDrug`)}
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              New Drug
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <div className="alert alert-danger">{error}</div>
          </Col>
        </Row>
      )}

      <DrugDetailsModal 
        drug={selectedDrug}
        show={showModal}
        onHide={() => setShowModal(false)}
        onAddToCart={handleAddToCart}
      />

      <CartModal
        show={showCartModal}
        onHide={() => setShowCartModal(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onGenerateInvoice={handleCreateInvoice}
      />

      <InvoiceForm
        show={showInvoiceForm}
        onHide={() => setShowInvoiceForm(false)}
        cartItems={cartItems}
        total={calculateTotal()}
        onSubmit={handleCreateInvoice}
      />

      <Modal 
        show={showInvoicePreview} 
        onHide={handleCloseInvoice}
        size="lg"
        centered
        className="invoice-preview-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Facture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentInvoice && (
            <div className="invoice-preview">
              <div className="invoice-header">
                <h4>CompuClinic</h4>
                <p>Date: {new Date().toLocaleDateString()}</p>
              </div>

              <div className="customer-details">
                <h5>Patient's Information</h5>
                <p><strong>Name:</strong> {currentInvoice.patientName}</p>
                <p><strong>Telephone:</strong> {currentInvoice.patientPhone}</p>
                <p><strong>Method of payment:</strong> {currentInvoice.paymentMethod}</p>
              </div>

              <div className="invoice-items">
                <h5>Command Details</h5>
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>Drug</th>
                      <th>Unitary price</th>
                      <th>Quantity</th>
                      <th>Sub-total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvoice.items.map((item) => (
                      <tr key={item.drugId}>
                        <td>{item.name}</td>
                        <td>{item.unitPrice} FCFA</td>
                        <td>{item.quantity}</td>
                        <td>{item.subtotal.toFixed(2)} FCFA</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                      <td><strong>{currentInvoice.total.toFixed(2)} FCFA</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {currentInvoice.comment && (
                <div className="invoice-comment">
                  <h5>Comment</h5>
                  <p>{currentInvoice.comment}</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseInvoice}>
            Close
          </Button>
          <Button variant="primary" onClick={() => window.print()}>
            Print
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="content-area">
        <div className="sidebar">
          <Nav className="flex-column">
            {getSubCategories().map((subCat) => (
              <Nav.Link
                key={subCat}
                active={activeSubCategory === subCat}
                onClick={() => setActiveSubCategory(subCat)}
              >
                {subCat}
              </Nav.Link>
            ))}
          </Nav>
        </div>

        <div className="main-content">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : filteredDrugs.length === 0 ? (
            <div className="no-drugs">
              <p>No drug found{activeSubCategory ? ` pour ${activeCategory}: ${activeSubCategory}` : ''}.</p>
            </div>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {filteredDrugs.map((drug) => (
                <Col key={drug.id}>
                  <DrugCard 
                    drug={drug} 
                    onViewDetails={() => {
                      setSelectedDrug(drug);
                      setShowModal(true);
                    }}
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </Container>
  );
};

export default withRouter(PharmacyDashboard);
