import { Injectable } from '@angular/core';
import { Cart } from '../models/cart.interface';
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  // Generates a PDF invoice from the last checkout stored in sessionStorage
  generatePDF(): void {
    const temp = sessionStorage.getItem('tempCart');
    if (!temp) return;

    const cart: Cart[] = JSON.parse(temp);
    if (cart.length < 1) return;

    const doc = new jsPDF('portrait', 'mm', 'a4');

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(50);
    doc.text('INVOICE', 14, 25);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', 14, 37);
    doc.setFont('helvetica', 'normal');
    doc.text(formattedDate, 25, 37);

    const startY = 45;

    // Table data for each product
    const tableData: RowInput[] = cart.map((item) => [
      item.title,
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`,
    ]);

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Add total row with special styling
    tableData.push([
      {
        content: 'Total',
        colSpan: 3,
        styles: {
          halign: 'right',
          fontStyle: 'bold',
          textColor: [255, 255, 255],
          fillColor: [52, 58, 64],
          fontSize: 12,
          minCellHeight: 10,
        },
      },
      {
        content: `$${total.toFixed(2)}`,
        styles: {
          halign: 'right',
          fontStyle: 'bold',
          textColor: [255, 255, 255],
          fillColor: [52, 58, 64],
          fontSize: 12,
          minCellHeight: 10,
        },
      },
    ]);

    // Generate table using jsPDF autotable
    autoTable(doc, {
      startY,
      head: [['Title', 'Quantity', 'Price', 'Total']],
      body: tableData,
      theme: 'plain',
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 3,
        valign: 'middle',
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [52, 58, 64],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      columnStyles: {
        1: { halign: 'right', cellWidth: 20 },
        2: { halign: 'right', cellWidth: 25 },
        3: { halign: 'right', cellWidth: 25 },
      },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      didParseCell: (data) => {
        const rowIndex = data.row.index;
        if (rowIndex !== tableData.length - 1 && data.section === 'body') {
          data.cell.styles.lineWidth = 0;
        }
      },
      didDrawPage: (data) => {
        const pages = doc.getNumberOfPages();
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.text(
          `Page ${data.pageNumber} of ${pages}`,
          doc.internal.pageSize.getWidth() - 40,
          doc.internal.pageSize.getHeight() - 10
        );
      },
    });

    doc.save(`Invoice_${formattedDate}.pdf`);
  }
}
