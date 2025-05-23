import React from 'react';
import { saveAs } from 'file-saver';

// Fonction pour générer le numéro de facture
const getInvoiceNumber = () => {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_H${String(now.getHours()).padStart(2, '0')}S${String(now.getSeconds()).padStart(2, '0')}`;
};

// Fonction pour diviser le texte en plusieurs lignes selon une largeur maximale
const wrapText = (text, maxLength) => {
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach((word) => {
        if ((currentLine + word).length <= maxLength) {
            currentLine += (currentLine === '' ? '' : ' ') + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    });

    if (currentLine !== '') {
        lines.push(currentLine);
    }

    return lines;
};

// Fonction pour générer le contenu de la facture en texte
const generateInvoiceText = (cartItems) => {
    let invoiceText = `HÔPITAL RÉGIONAL\n`;
    invoiceText += `123 Avenue de la Santé\n`;
    invoiceText += `Téléphone: +123 456 789\n`;
    invoiceText += `Email: contact@hopital.com\n\n`;

    invoiceText += `Facture N°: ${getInvoiceNumber()}\n`;
    invoiceText += `Date: ${new Date().toLocaleDateString()}\n\n`;

    invoiceText += `FACTURE\n\n`;

    // Définir les largeurs maximales pour chaque colonne
    const columnWidths = {
        name: 20,    // Nom du médicament
        quantity: 10, // Quantité
        unitPrice: 15, // Prix unitaire
        subtotal: 15  // Sous-total
    };

    // En-têtes de colonnes
    invoiceText += `Médicament${' '.repeat(columnWidths.name - 'Médicament'.length)}`;
    invoiceText += `Quantité${' '.repeat(columnWidths.quantity - 'Quantité'.length)}`;
    invoiceText += `Prix unitaire${' '.repeat(columnWidths.unitPrice - 'Prix unitaire'.length)}`;
    invoiceText += `Sous-total\n`;
    invoiceText += '-'.repeat(columnWidths.name + columnWidths.quantity + columnWidths.unitPrice + columnWidths.subtotal + 3) + '\n';

    // Articles
    let totalQuantity = 0;
    let totalUnitPrice = 0;
    let totalAmount = 0;

    cartItems.forEach((item) => {
        const nameLines = wrapText(`${item.name} (${item.genericName})`, columnWidths.name);
        const quantity = item.quantity.toString().padEnd(columnWidths.quantity, ' ');
        const unitPrice = `${item.unitPrice} FCFA`.padEnd(columnWidths.unitPrice, ' ');
        const subtotal = `${(item.quantity * item.unitPrice).toFixed(2)} FCFA`.padEnd(columnWidths.subtotal, ' ');

        // Ajouter au total de la quantité et du prix unitaire
        totalQuantity += item.quantity;
        totalUnitPrice += item.unitPrice;
        totalAmount += item.quantity * item.unitPrice;

        // Nombre de lignes nécessaires pour afficher le nom du médicament
        const maxLines = Math.max(nameLines.length, 1);

        for (let i = 0; i < maxLines; i++) {
            const name = (i < nameLines.length ? nameLines[i] : '').padEnd(columnWidths.name, ' ');
            invoiceText += `${name}`;

            if (i === 0) {
                invoiceText += `${quantity}`;
                invoiceText += `${unitPrice}`;
                invoiceText += `${subtotal}\n`;
            } else {
                invoiceText += `${' '.repeat(columnWidths.quantity)}`; // Espace pour la quantité
                invoiceText += `${' '.repeat(columnWidths.unitPrice)}`; // Espace pour le prix unitaire
                invoiceText += `${' '.repeat(columnWidths.subtotal)}\n`; // Espace pour le sous-total
            }
        }
    });

    // Séparation avant les totaux
    invoiceText += '-'.repeat(columnWidths.name + columnWidths.quantity + columnWidths.unitPrice + columnWidths.subtotal + 3) + '\n';

    // Sous-total pour la quantité
    invoiceText += `Total Quantité: ${totalQuantity.toString().padEnd(columnWidths.quantity, ' ')}`;
    invoiceText += `${' '.repeat(columnWidths.unitPrice)}`; // Espace pour le prix unitaire
    invoiceText += `${' '.repeat(columnWidths.subtotal)}\n`; // Espace pour le sous-total

    // Sous-total pour le prix unitaire
    invoiceText += `Total Prix: ${' '.repeat(columnWidths.quantity)}`;
    invoiceText += `${totalUnitPrice.toFixed(2)} FCFA`.padEnd(columnWidths.unitPrice, ' ');
    invoiceText += `${' '.repeat(columnWidths.subtotal)}\n`; // Espace pour le sous-total

    // Séparation avant le total général
    invoiceText += '-'.repeat(columnWidths.name + columnWidths.quantity + columnWidths.unitPrice + columnWidths.subtotal + 3) + '\n';

    // Total général
    invoiceText += `Total: ${' '.repeat(columnWidths.name + columnWidths.quantity + columnWidths.unitPrice - 'Total:'.length)}`;
    invoiceText += `${totalAmount.toFixed(2)} FCFA\n\n`;

    // Pied de page
    invoiceText += `Merci de votre confiance. Ce document tient lieu de facture.`;

    return invoiceText;
};

// Fonction pour générer et télécharger le fichier texte
const generateTXT = (cartItems) => {
    const invoiceText = generateInvoiceText(cartItems);
    const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8' });
    const fileName = `facture_${getInvoiceNumber()}.txt`;
    saveAs(blob, fileName);
};

// Composant principal à exporter
const HospitalInvoice = ({ cartItems, onClose }) => {
    const handleGenerateInvoice = () => {
        try {
            generateTXT(cartItems);
            if (onClose) {
                onClose(); // Ferme le modal après la génération
            }
        } catch (error) {
            console.error('Erreur lors de la génération du fichier texte:', error);
            alert('Une erreur est survenue lors de la génération de la facture.');
        }
    };

    return handleGenerateInvoice();
};

export default HospitalInvoice;