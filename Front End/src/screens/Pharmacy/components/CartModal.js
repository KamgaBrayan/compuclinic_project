import React from 'react';
import { Modal, ListGroup, Badge, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import './CartModal.css';
import HospitalInvoice from './HospitalInvoice';

const CartModal = ({ show, onHide, cartItems, updateQuantity, removeFromCart, proceedToCheckout }) => {
  const total = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  const handleGenerateInvoice = () => {
      HospitalInvoice({ cartItems, onClose: onHide });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="cart-modal">
      <Modal.Header closeButton>
        <Modal.Title>Cart ({cartItems.length} articles)</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.id} className="cart-item">
                <div className="item-details">
                  <h5>{item.name}</h5>
                  <p className="text-muted">{item.genericName}</p>
                  <div className="item-price">{item.unitPrice} FCFA / unit</div>
                </div>
                <div className="item-quantity">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </Button>
                  <span className="quantity-display">{item.quantity}</span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </div>
                <div className="item-subtotal">
                  <div className="subtotal-label">Sub-total:</div>
                  <div className="subtotal-amount">{(item.quantity * item.unitPrice).toFixed(2)} FCFA</div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  className="remove-button"
                  onClick={() => removeFromCart(item.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      {cartItems.length > 0 && (
        <Modal.Footer>
          <div className="cart-summary">
            <div className="total-amount">
              <span>Total:</span>
              <span className="amount">{total.toFixed(2)} FCFA</span>
            </div>
            <Button variant="primary" onClick={handleGenerateInvoice}>
              Generate Invoice
            </Button>
          </div>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default CartModal;
