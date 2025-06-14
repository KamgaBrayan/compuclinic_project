import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Nav, Tab, Modal, Badge, Button, Container, Form, InputGroup } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSearch, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
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
const DrugDetailsModal = ({ drug, show, onHide, onAddToCart, history }) => {
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
                <Button
                  variant="secondary"
                  // className="add-to-cart-btn"
                  // onClick={handleAddToCart}
                  onClick={() => history.push(`${process.env.PUBLIC_URL}/editDrug/${drug.id}`)}
                  disabled={drug.stock === 0}
                >
                  Edit
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
          // src={drug.photoUrl || 'https://www.universityofcalifornia.edu/sites/default/files/generic-drugs-istock.jpg'}
          src={drug.photoUrl || drug.type === 'drug' ? 'https://www.universityofcalifornia.edu/sites/default/files/generic-drugs-istock.jpg': 'https://www.ugabox.com/images/medical/directory/laboratory-instruments/laboratory-instruments-Hospital-Medical-Equipment-Kampala-Uganda-Ugabox.jpg'}
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
  const [categorySearchTerm, setCategorySearchTerm] = useState(''); // **NEW: State for sidebar search**
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);

  const fetchDrugs = async (query = '') => {
    try {
      setLoading(true);
      setError(null);
      const url = query
        ? `${wServer.GET.PHARMACY.SEARCH}?field=name&query=${encodeURIComponent(query)}`
        : wServer.GET.PHARMACY.ALL;

      const response = await axios.get(url);

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

  const handleCategorySelect = (selectedKey) => {
    setActiveCategory(selectedKey);
    setActiveSubCategory(''); // Reset sub-category filter when main category changes
    setCategorySearchTerm(''); // Reset sidebar search term
  };

  // **NEW: Filtered list of sub-categories based on sidebar search**
  const getFilteredSubCategories = () => {
    if (!Array.isArray(drugs)) {
      return [];
    }

    let allSubCategories = [];
    switch (activeCategory) {
      case 'dosage':
        allSubCategories = [...new Set(drugs.map(drug => drug.dosageForm).filter(Boolean))];
        break;
      case 'type':
        allSubCategories = [...new Set(drugs.map(drug => drug.type).filter(Boolean))];
        break;
      case 'administration':
        allSubCategories = [...new Set(drugs.map(drug => drug.administrationMethod).filter(Boolean))];
        break;
      case 'laboratory':
        allSubCategories = [...new Set(drugs.map(drug => drug.laboratory).filter(Boolean))];
        break;
      default:
        allSubCategories = [];
    }

    if (!categorySearchTerm.trim()) {
      return allSubCategories;
    }

    return allSubCategories.filter(cat =>
      cat.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );
  };

  const filteredSubCategories = getFilteredSubCategories();

  const filterDrugs = () => {
    if (!Array.isArray(drugs)) {
      return [];
    }
    if (!activeSubCategory) {
      return drugs; // If no sub-category is selected, show all drugs
    }

    return drugs.filter(drug => {
      switch (activeCategory) {
        case 'dosage':
          return drug.dosageForm === activeSubCategory;
        case 'administration':
          return drug.administrationMethod === activeSubCategory;
        case 'laboratory':
          return drug.laboratory === activeSubCategory;
        case 'type':
          return drug.type === activeSubCategory;
        default:
          return true;
      }
    });
  };

  const filteredDrugs = filterDrugs();


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

    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const handleCloseInvoice = () => {
    setShowInvoicePreview(false);
    setCurrentInvoice(null);
    setCartItems([]);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  return (
    <Container fluid className="pharmacy-dashboard">
      <Row className="mb-4">
        <Col>
          <h2>Drugs & Equipment Management</h2>
        </Col>
      </Row>

      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <Nav variant="tabs" activeKey={activeCategory} onSelect={handleCategorySelect}>
            <Nav.Item>
              <Nav.Link eventKey="type">Type (Drug or Equipment)</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="dosage">Form</Nav.Link>
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
          <div className="d-flex  gap-2">
            <Form onSubmit={handleSearch} className="search-bar flex-grow-1">
              <InputGroup className="px-3">
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

              className="add-drug-button"
              onClick={() => history.push(`${process.env.PUBLIC_URL}/addDrug`)}
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              New Drug or Equipment
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
        history={history}
      />

      <CartModal
        show={showCartModal}
        onHide={() => setShowCartModal(false)}
        cartItems={cartItems}
        updateQuantity={handleUpdateQuantity}
        removeFromCart={handleRemoveFromCart}
        proceedToCheckout={handleCheckout}
      />

      <InvoiceForm
        show={showInvoiceForm}
        onHide={() => setShowInvoiceForm(false)}
        cartItems={cartItems}
        total={calculateTotal()}
        onSubmit={handleCreateInvoice}
      />

      {/* Reste du code pour les modales de facture inchangé... */}

      <div className="content-area">
        <div className="sidebar">
          {/* **NEW: Sidebar search bar and header** */}
          <div className="sidebar-header">
            <h5>Categories</h5>
            <Form.Group className="mt-2 mb-3 sidebar-search">
              <InputGroup size="sm">
                <Form.Control
                  type="text"
                  placeholder={`Search ${activeCategory}...`}
                  value={categorySearchTerm}
                  onChange={(e) => setCategorySearchTerm(e.target.value)}
                />
                {categorySearchTerm &&
                  <Button variant="outline-secondary" onClick={() => setCategorySearchTerm('')}>
                    <FontAwesomeIcon icon={faTimes} />
                  </Button>
                }
              </InputGroup>
            </Form.Group>
          </div>
          <Nav className="flex-column">
            {/* **MODIFIED: Use the filtered list** */}
            {filteredSubCategories.length > 0 ? (
              filteredSubCategories.map((subCat) => (
                <Nav.Link
                  key={subCat}
                  active={activeSubCategory === subCat}
                  onClick={() => setActiveSubCategory(subCat)}
                >
                  {subCat}
                </Nav.Link>
              ))
            ) : (
              <div className="no-categories-found">No category found.</div>
            )}
          </Nav>
        </div>

        <div className="main-content">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : filteredDrugs.length === 0 ? (
            <div className="no-drugs">
              <p>No drug found{activeSubCategory ? ` for ${activeCategory}: ${activeSubCategory}` : ''}.</p>
            </div>
          ) : (
            <Row xs={1} md={2} lg={3} xl={4} className="">
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
