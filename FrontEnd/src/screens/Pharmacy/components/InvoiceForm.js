import React, { useState } from 'react';
import { Modal, Form, Button, ListGroup } from 'react-bootstrap';
import './InvoiceForm.css';

const InvoiceForm = ({ show, onHide, cartItems, total, onSubmit }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    paymentMethod: 'cash',
    comment: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const invoice = {
      ...formData,
      items: cartItems,
      total: total,
      date: new Date().toISOString()
    };

    onSubmit(invoice);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="invoice-form-modal">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Générer une facture</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <div className="invoice-sections">
            <section className="customer-info">
              <h5>Informations du patient</h5>
              <Form.Group className="mb-3">
                <Form.Label>Nom complet</Form.Label>
                <Form.Control
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Téléphone</Form.Label>
                <Form.Control
                  type="tel"
                  name="patientPhone"
                  value={formData.patientPhone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mode de paiement</Form.Label>
                <Form.Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                >
                  <option value="cash">Espèces</option>
                  <option value="card">Carte bancaire</option>
                  <option value="mobile">Mobile Money</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Commentaire (optionnel)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                />
              </Form.Group>
            </section>

            <section className="order-summary">
              <h5>Résumé de la commande</h5>
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item.id} className="invoice-item">
                    <div className="item-name">
                      <strong>{item.name}</strong>
                      <small className="text-muted d-block">{item.genericName}</small>
                    </div>
                    <div className="item-details">
                      <span className="quantity">{item.quantity} x</span>
                      <span className="price">{item.unitPrice} FCFA</span>
                      <span className="subtotal">{(item.quantity * item.unitPrice).toFixed(2)} FCFA</span>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              
              <div className="total-section">
                <div className="total-line">
                  <span>Total</span>
                  <span className="total-amount">{total.toFixed(2)} FCFA</span>
                </div>
              </div>
            </section>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            Générer la facture
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default InvoiceForm;
