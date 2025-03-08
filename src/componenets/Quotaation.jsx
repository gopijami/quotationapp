import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

const Quotation = () => {
    const [address, setAddress] = useState('');
    const [gstPercentage, setGstPercentage] = useState('18');
    const [rows, setRows] = useState([
        { companyName: '', materialDescription: '', price: '', approxOrder: '', totalAmount: '' },
    ]);

    const calculateTotal = () => {
        return rows.reduce((acc, row) => acc + parseFloat(row.totalAmount) || 0, 0);
    };

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        if (field === 'price' || field === 'approxOrder') {
            const price = parseFloat(updatedRows[index].price) || 0;
            const approxOrder = parseFloat(updatedRows[index].approxOrder) || 0;
            updatedRows[index].totalAmount = (price * approxOrder).toFixed(2);
        }
        setRows(updatedRows);
    };

    const handleAddRow = () => {
        setRows([...rows, { companyName: '', materialDescription: '', price: '', approxOrder: '', totalAmount: '' }]);
    };

    const handleDownloadPDF =async  () => {
        const currentDate = new Date().toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
        const total = calculateTotal();
        const gstAmount = (total * (parseFloat(gstPercentage) / 100)).toFixed(2);
        const grandTotal = (parseFloat(total) + parseFloat(gstAmount)).toFixed(2);

        const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
          // Header details
          doc.setFillColor(0, 51, 102);
          doc.rect(0, 0, 595, 100, 'F');
          doc.setTextColor(255, 0, 0); // Red color
          doc.setFontSize(11);   
          doc.setFont('helvetica', 'bold');       // Smaller font size
          doc.text('QUOTATION', 250, 13);

          doc.setFontSize(9);
          doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'normal'); // Regular text
        doc.text(' Ph: +91-9959850202, 9515454559', doc.getTextWidth('QUOTATION') + 380, 13);

          doc.setTextColor(255, 0, 0);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(20);
          doc.text('SRINUVASULU SAFETY NETS', 297.5, 40, { align: 'center' });

          doc.setFontSize(10);
          doc.setTextColor(255, 255, 255);
          doc.text('#18-78/1/A, S.B.H.colony, Gaddiannaram, Dilsukhnagar, Hyderabad, Telangana', 297.5, 60, { align: 'center' });
          doc.text('Branch: Miyapur Nizampet‘x’ road, SardarpetNagar, Hyderabad, Telangana', 297.5, 75, { align: 'center' });

          doc.setTextColor(255, 0, 0); // Red color
        doc.setFont('helvetica', 'bold'); // Bold text
        doc.text('GST NO:', 250.5, 90, { align: 'center' });

        // GST Number in black (following immediately)
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'normal'); // Regular text
        doc.text(' 36BOCPJ0108K1Z9', doc.getTextWidth('GST NO:') + 230, 90);

          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);
        doc.text(`Date: ${currentDate}`, 500, 110);
        doc.setFont('helvetica', 'bold'); // Set "To:" in bold
        doc.setFontSize(14);
        doc.text('To:', 40, 120); 
        doc.setFontSize(10); 
        doc.setFont('helvetica', 'normal'); // Reset to normal for the address
        const formatText = (address) => {
            return address.replace(/(.{40})/g, '$1\n');  // Breaks after every 80 characters
        };
        const formateData = formatText(address)
        doc.text(formateData, 40, 130);
        const numberOfRows = formateData.split('\n').length;
        console.log(`Number of rows: ${numberOfRows}`);
// Create watermark with opacity
const watermarkImage = await fetch('/watermark.png')
.then(res => res.blob())
.then(blob => new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(blob);

    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.globalAlpha = 0.3; // Opacity control
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL('image/png'));
    };
}));

doc.addImage(watermarkImage, 'PNG', 0, 100, 600, 500, '', 'FAST');
          autoTable(doc, {
            startY: 140 + (parseInt(numberOfRows)*10),
            head: [['S.NO', 'Company Name', 'Material Description', 'Price', 'Approx Order', 'Total Amount']],
            body: rows.map((row, index) => [
                index + 1,
                row.companyName,
                row.materialDescription,
                `Rs: ${row.price}`,
                row.approxOrder,
                `Rs: ${row.totalAmount}`
            ]),
            theme: 'grid',
            styles: { fillColor: false, lineColor: [0, 0, 0], lineWidth: 0.5 },
            headStyles: { fillColor: false, textColor: [255, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.5 },
        });

        const rightCornerY = doc.lastAutoTable.finalY;
        autoTable(doc, {
            startY: rightCornerY,
            margin: { left: 400 },
            body: [
                ['Total', `Rs ${total}`],
                [`GST (${gstPercentage}%)`, `Rs ${gstAmount}`],
                ['Grand Total', `Rs ${grandTotal}`]
            ],
            theme: 'grid',
            styles: { fillColor: false, lineColor: [0, 0, 0], lineWidth: 0.5 },
            headStyles: { fillColor: false, textColor: [255, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.5 },
            didParseCell: function (data) {
                if (data.section === 'body' && data.column.index === 0) {
                    data.cell.styles.textColor = [255, 0, 0]; // Red color for the first column
                }
            },
        });

       

        doc.save('Quotation.pdf');
    };

    const addname = "kljsdkljdfknlkdsjjjjjjjjjnljnkjcvbjmsnjvnsjdlmnvlvjsdnmnsdojncldmcnsdmnjodnlkmaionc    "
    console.log(addname.length)

    return (
        <Container>
            <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Quotation Form
                </Typography>
                <TextField
                    multiline
                    rows={4}             // Adjust the number of visible rows
                    fullWidth 
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    sx={{
                        '& .MuiInputBase-input': {
                            whiteSpace: 'pre-wrap',    // Preserves spaces and line breaks
                            wordBreak: 'break-word',   // Ensures words break at the right point
                            maxWidth: '40ch',          // Limits to ~80 characters per line
                        }
                    }}
                />

                <TextField
                    fullWidth
                    label="GST Percentage"
                    value={gstPercentage}
                    onChange={(e) => setGstPercentage(e.target.value)}
                    margin="normal"
                    type="number"
                />

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Company Name</TableCell>
                                <TableCell>Material Description</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Approx Order</TableCell>
                                <TableCell>Total Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <TextField
                                        multiline
                                        rows={4}             // Adjust the number of visible rows
                                        fullWidth 
                                            value={row.companyName}
                                            onChange={(e) => handleInputChange(index, 'companyName', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            multiline
                                            rows={4}             // Adjust the number of visible rows
                                            fullWidth 
                                            value={row.materialDescription}
                                            onChange={(e) => handleInputChange(index, 'materialDescription', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={row.price}
                                            onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                                            type="number"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={row.approxOrder}
                                            onChange={(e) => handleInputChange(index, 'approxOrder', e.target.value)}
                                            type="number"
                                        />
                                    </TableCell>
                                    <TableCell>{row.totalAmount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2, marginRight: 2 }}
                    onClick={handleAddRow}
                >
                    Add Row
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    sx={{ marginTop: 2 }}
                    onClick={handleDownloadPDF}
                >
                    Download Quotation
                </Button>
            </Paper>
        </Container>
    );
};

export default Quotation;
