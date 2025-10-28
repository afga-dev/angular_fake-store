import { inject, Injectable, signal } from '@angular/core';
import { Cart } from '../models/cart.interface';
import { UserService } from './user.service';
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private userService = inject(UserService);

  private cart = signal<Cart[]>([]);
  readonly getCartSignal = this.cart.asReadonly();
  private isOpen = signal<boolean>(false);
  readonly getIsOpen = this.isOpen.asReadonly();

  getCart(): void {
    const cart = localStorage.getItem('cart');
    const parsedCart = cart ? JSON.parse(cart) : [];
    if (cart) {
      const cartItems: Cart[] = (parsedCart || []).map((item: any) => ({
        id: Number(item.id),
        title: String(item.title),
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: String(item.image),
      }));
      this.cart.set(cartItems);
    }
  }

  createCart(product: Product): Cart {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.image,
    };
  }

  setIsOpen(state: boolean): void {
    this.isOpen.set(state);
  }

  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart()));
  }

  totalCart(): number {
    const total = this.cart().reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );

    if (this.userService.isSignedOn()) {
      return total * (1 - 15 / 100);
    } else {
      return total;
    }
  }

  decreaseQuantity(id: number): void {
    const cart = [...this.cart()];
    const product = cart.find((p) => p.id === id);
    if (!product) return;

    product.quantity--;

    if (product.quantity < 1) {
      this.removeProduct(id);
    } else {
      this.cart.set(cart);
      this.saveCart();
    }
  }

  incrementQuantity(id: number): void {
    const cart = [...this.cart()];
    const product = cart.find((p) => p.id === id);
    if (!product) return;

    product.quantity++;

    this.cart.set(cart);
    this.saveCart();
  }

  addProduct(product: Cart) {
    const cart = [...this.cart()];
    const getProduct = cart.find((p) => p.id === product.id);

    if (getProduct) {
      getProduct.quantity++;
    } else {
      cart.push({ ...product, quantity: product.quantity || 1 });
    }

    this.cart.set(cart);
    this.saveCart();
  }

  removeProduct(id: number): void {
    this.cart.set(this.cart().filter((p) => p.id !== id));
    this.saveCart();
  }

  onCheckout(): void {
    const tempCart = this.cart();

    sessionStorage.setItem('tempCart', JSON.stringify(tempCart));
    this.cart.set([]);
    localStorage.clear();
  }

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

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(50);
    doc.text('INVOICE', 14, 25);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', 14, 37);
    doc.setFont('helvetica', 'normal');
    doc.text(formattedDate, 25, 37);

    const startY = 45;

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
