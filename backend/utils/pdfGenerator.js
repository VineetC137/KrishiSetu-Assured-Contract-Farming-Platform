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
    
    // Header with logo placeholder
    doc.setFillColor(22, 163, 74); // Green color
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('🌱 KRISHISETU', 20, 25);
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text('Assured Contract Farming Platform', 20, 35);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Contract title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('CONTRACT FARMING AGREEMENT', 105, 55, { align: 'center' });
    
    // Contract details box
    doc.setDrawColor(22, 163, 74);
    doc.setLineWidth(0.5);
    doc.rect(15, 65, 180, 25);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    let yPosition = 75;
    
    doc.text('Contract ID: ' + contract._id.toString().substring(0, 8).toUpperCase(), 20, yPosition);
    doc.text('Generated: ' + new Date().toLocaleDateString('en-IN'), 120, yPosition);
    yPosition += 8;
    doc.text('Status: ' + contract.status, 20, yPosition);
    doc.text('Category: ' + contract.category.toUpperCase(), 120, yPosition);
    
    yPosition = 105;
    
    // Parties section
    doc.setFillColor(248, 250, 252);
    doc.rect(15, yPosition - 5, 180, 50, 'F');
    
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text('CONTRACTING PARTIES', 20, yPosition + 5);
    
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    yPosition += 15;
    doc.text('FARMER (Producer):', 20, yPosition);
    doc.text('BUYER (Purchaser):', 110, yPosition);
    
    doc.setFont(undefined, 'normal');
    yPosition += 8;
    doc.text('Name: ' + (farmer.profile?.fullName || farmer.username), 20, yPosition);
    doc.text('Name: ' + (buyer.profile?.fullName || buyer.username), 110, yPosition);
    yPosition += 6;
    doc.text('Email: ' + farmer.email, 20, yPosition);
    doc.text('Email: ' + buyer.email, 110, yPosition);
    yPosition += 6;
    if (farmer.profile?.phone) {
      doc.text('Phone: ' + farmer.profile.phone, 20, yPosition);
    }
    if (buyer.profile?.phone) {
      doc.text('Phone: ' + buyer.profile.phone, 110, yPosition);
    }
    
    yPosition += 20;
    
    // Product details section
    doc.setFillColor(254, 249, 195);
    doc.rect(15, yPosition - 5, 180, 45, 'F');
    
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text('PRODUCT SPECIFICATIONS', 20, yPosition + 5);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(12);
    yPosition += 15;
    
    const productDetails = [
      ['Product Type:', contract.cropType + (contract.variety ? ` (${contract.variety})` : '')],
      ['Quantity:', `${contract.quantity} ${contract.unit}`],
      ['Unit Price:', `₹${contract.price} per ${contract.unit}`],
      ['Total Value:', `₹${(contract.quantity * contract.price).toLocaleString('en-IN')}`],
      ['Delivery Date:', new Date(contract.deliveryDate).toLocaleDateString('en-IN')]
    ];
    
    productDetails.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, 20, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(value, 70, yPosition);
      yPosition += 7;
    });
    
    yPosition += 10;
    
    // Delivery location
    if (contract.deliveryLocation?.address) {
      doc.setFont(undefined, 'bold');
      doc.text('DELIVERY LOCATION:', 20, yPosition);
      doc.setFont(undefined, 'normal');
      yPosition += 8;
      const location = `${contract.deliveryLocation.address}, ${contract.deliveryLocation.city}, ${contract.deliveryLocation.state} - ${contract.deliveryLocation.pincode}`;
      const splitLocation = doc.splitTextToSize(location, 170);
      doc.text(splitLocation, 20, yPosition);
      yPosition += splitLocation.length * 6 + 10;
    }
    
    // Quality parameters
    if (contract.qualityParameters?.specifications) {
      doc.setFont(undefined, 'bold');
      doc.text('QUALITY SPECIFICATIONS:', 20, yPosition);
      doc.setFont(undefined, 'normal');
      yPosition += 8;
      const specs = doc.splitTextToSize(contract.qualityParameters.specifications, 170);
      doc.text(specs, 20, yPosition);
      yPosition += specs.length * 6 + 10;
    }
    
    // Equipment support
    if (contract.equipmentSupport?.required) {
      doc.setFont(undefined, 'bold');
      doc.text('EQUIPMENT SUPPORT:', 20, yPosition);
      doc.setFont(undefined, 'normal');
      yPosition += 8;
      doc.text('Items: ' + contract.equipmentSupport.items.join(', '), 20, yPosition);
      yPosition += 6;
      if (contract.equipmentSupport.details) {
        const details = doc.splitTextToSize(contract.equipmentSupport.details, 170);
        doc.text(details, 20, yPosition);
        yPosition += details.length * 6;
      }
      yPosition += 10;
    }
    
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Terms and conditions
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text('TERMS & CONDITIONS:', 20, yPosition);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    yPosition += 10;
    
    const terms = contract.terms || 'Standard contract terms and conditions apply as per KrishiSetu platform guidelines.';
    const splitTerms = doc.splitTextToSize(terms, 170);
    doc.text(splitTerms, 20, yPosition);
    yPosition += splitTerms.length * 5 + 15;
    
    // Digital signatures section
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text('DIGITAL SIGNATURES:', 20, yPosition);
    yPosition += 15;
    
    // Signature boxes
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    
    // Farmer signature
    doc.rect(20, yPosition, 80, 30);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(10);
    doc.text('FARMER SIGNATURE', 22, yPosition + 5);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    if (contract.digitalSignatures?.farmer?.signed) {
      doc.text('✓ Digitally Signed', 22, yPosition + 12);
      doc.text('Date: ' + new Date(contract.digitalSignatures.farmer.signedAt).toLocaleDateString('en-IN'), 22, yPosition + 18);
    } else {
      doc.text('Pending', 22, yPosition + 12);
    }
    
    // Buyer signature
    doc.rect(110, yPosition, 80, 30);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(10);
    doc.text('BUYER SIGNATURE', 112, yPosition + 5);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    if (contract.digitalSignatures?.buyer?.signed) {
      doc.text('✓ Digitally Signed', 112, yPosition + 12);
      doc.text('Date: ' + new Date(contract.digitalSignatures.buyer.signedAt).toLocaleDateString('en-IN'), 112, yPosition + 18);
    } else {
      doc.text('Pending', 112, yPosition + 12);
    }
    
    yPosition += 45;
    
    // Footer
    doc.setDrawColor(22, 163, 74);
    doc.setLineWidth(1);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('This contract is digitally generated and managed by KrishiSetu Platform', 105, yPosition, { align: 'center' });
    yPosition += 6;
    doc.text('For support: support@krishisetu.com | www.krishisetu.com', 105, yPosition, { align: 'center' });
    yPosition += 6;
    doc.setFontSize(8);
    doc.text('Generated on: ' + new Date().toLocaleString('en-IN'), 105, yPosition, { align: 'center' });
    
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