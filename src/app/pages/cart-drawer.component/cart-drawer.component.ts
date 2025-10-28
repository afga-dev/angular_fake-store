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

  private hasPurchased = signal<boolean>(false);

  readonly isCartOpen = this.cartService.getIsOpen;
  readonly hasPurchasedSignal = this.hasPurchased.asReadonly();

  closeCart = output<void>();

  readonly resetPurchaseOnOpen = effect(() => {
    if (this.cartService.getIsOpen()) this.hasPurchased.set(false);
  });

  ngOnInit(): void {
    this.cartService.getCart();
  }

  getCart(): Cart[] {
    return this.cartService.getCartSignal();
  }

  getTotal(): number {
    return this.cartService.totalCart();
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
    this.cartService.onCheckout();
    this.hasPurchased.set(true);
  }

  onGeneratePDF(): void {
    this.cartService.generatePDF();
  }
}
