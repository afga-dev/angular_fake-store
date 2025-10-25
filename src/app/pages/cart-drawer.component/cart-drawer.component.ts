import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, output } from '@angular/core';
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

  isCartOpen = this.cartService.getIsOpen;
  closeCart = output<void>();

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
    return this.cartService.decreaseQuantity(id);
  }

  increaseQuantity(id: number): void {
    return this.cartService.incrementQuantity(id);
  }

  removeProduct(id: number): void {
    return this.cartService.removeProduct(id);
  }
}
