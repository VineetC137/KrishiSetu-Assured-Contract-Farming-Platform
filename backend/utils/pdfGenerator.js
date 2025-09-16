const { jsPDF } = require('jspdf');
const path = require('path');
const fs = require('fs');

// Ensure contracts directory exists
const contractsDir = path.join(__dirname, '../contracts');
if (!fs.existsSync(contractsDir)) {
  fs.mkdirSync(contractsDir, { recursive: true });
}

const generateContractPDF = async (contract, buyer, farmer) => {
  try {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('KRISHISETU CONTRACT AGREEMENT', 105, 30, { align: 'center' });
    
    // Contract details
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    
    let yPosition = 60;
    
    doc.text('Contract ID: ' + contract._id, 20, yPosition);
    yPosition += 10;
    doc.text('Date: ' + new Date().toLocaleDateString(), 20, yPosition);
    yPosition += 20;
    
    // Parties
    doc.setFont(undefined, 'bold');
    doc.text('FARMER DETAILS:', 20, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 10;
    doc.text('Name: ' + farmer.username, 20, yPosition);
    yPosition += 8;
    doc.text('Email: ' + farmer.email, 20, yPosition);
    yPosition += 20;
    
    doc.setFont(undefined, 'bold');
    doc.text('BUYER DETAILS:', 20, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 10;
    doc.text('Name: ' + buyer.username, 20, yPosition);
    yPosition += 8;
    doc.text('Email: ' + buyer.email, 20, yPosition);
    yPosition += 20;
    
    // Contract terms
    doc.setFont(undefined, 'bold');
    doc.text('CONTRACT TERMS:', 20, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 10;
    doc.text('Crop Type: ' + contract.cropType, 20, yPosition);
    yPosition += 8;
    doc.text('Quantity: ' + contract.quantity + ' kg', 20, yPosition);
    yPosition += 8;
    doc.text('Price per kg: ₹' + contract.price, 20, yPosition);
    yPosition += 8;
    doc.text('Total Value: ₹' + (contract.quantity * contract.price), 20, yPosition);
    yPosition += 8;
    doc.text('Delivery Date: ' + new Date(contract.deliveryDate).toLocaleDateString(), 20, yPosition);
    yPosition += 20;
    
    // Terms and conditions
    doc.setFont(undefined, 'bold');
    doc.text('TERMS & CONDITIONS:', 20, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 10;
    
    const terms = contract.terms || 'Standard contract terms and conditions apply.';
    const splitTerms = doc.splitTextToSize(terms, 170);
    doc.text(splitTerms, 20, yPosition);
    yPosition += splitTerms.length * 6 + 20;
    
    // Signatures
    doc.setFont(undefined, 'bold');
    doc.text('SIGNATURES:', 20, yPosition);
    yPosition += 20;
    
    doc.setFont(undefined, 'normal');
    doc.text('Farmer: _____________________', 20, yPosition);
    doc.text('Buyer: _____________________', 120, yPosition);
    yPosition += 20;
    
    doc.text('Date: ' + new Date().toLocaleDateString(), 20, yPosition);
    doc.text('Date: ' + new Date().toLocaleDateString(), 120, yPosition);
    
    // Footer
    yPosition += 30;
    doc.setFontSize(10);
    doc.text('This is a digitally generated contract by KrishiSetu Platform', 105, yPosition, { align: 'center' });
    
    // Save PDF
    const filename = `contract-${contract._id}-${Date.now()}.pdf`;
    const filepath = path.join(contractsDir, filename);
    
    const pdfBuffer = doc.output('arraybuffer');
    fs.writeFileSync(filepath, Buffer.from(pdfBuffer));
    
    return `/contracts/${filename}`;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate contract PDF');
  }
};

module.exports = { generateContractPDF };