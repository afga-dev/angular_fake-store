import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CartService } from '../../services/cart.service';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.css',
})
export class CartDrawerComponent implements OnInit {
  private cartService = inject(CartService);
  private invoiceService = inject(InvoiceService);

  // Tracks if a purchase has been completed, used to show the thank you message
  private _hasPurchased = signal<boolean>(false);
  readonly hasPurchased = this._hasPurchased.asReadonly();

  onCloseCart = output<void>();

  cart = computed(() => this.cartService.cart());
  isOpen = computed(() => this.cartService.isOpen());

  // Resets purchase state when cart drawer is opened
  readonly resetPurchaseOnOpen = effect(() => {
    if (this.isOpen()) this._hasPurchased.set(false);
  });

  ngOnInit(): void {
    this.cartService.loadCart();
  }

  onClose(): void {
    this.onCloseCart.emit();
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  decreaseQuantity(id: number): void {
    this.cartService.decreaseQuantity(id);
  }

  increaseQuantity(id: number): void {
    this.cartService.incrementQuantity(id);
  }

  removeProduct(id: number): void {
    this.cartService.removeProduct(id);
  }

  onCheckout(): void {
    this.cartService.checkout();
    this._hasPurchased.set(true);
  }

  onGeneratePDF(): void {
    this.invoiceService.generatePDF();
  }
}
