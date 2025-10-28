import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { Cart } from '../../models/cart.interface';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.css',
})
export class CartDrawerComponent implements OnInit {
  private cartService = inject(CartService);

  private _hasPurchased = signal<boolean>(false);
  readonly hasPurchased = this._hasPurchased.asReadonly();

  onCloseCart = output<void>();

  readonly resetPurchaseOnOpen = effect(() => {
    if (this.cartService.isOpen()) this._hasPurchased.set(false);
  });

  ngOnInit(): void {
    this.cartService.loadCart();
  }

  getCart(): Cart[] {
    return this.cartService.cart();
  }

  isCartOpen(): boolean {
    return this.cartService.isOpen();
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
    this.cartService.generatePDF();
  }
}
