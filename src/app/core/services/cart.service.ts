import { inject, Injectable, signal } from '@angular/core';
import { Cart } from '../models/cart.interface';
import { UserService } from './user.service';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private userService = inject(UserService);

  private _cart = signal<Cart[]>([]);
  readonly cart = this._cart.asReadonly();

  private _isOpen = signal<boolean>(false);
  readonly isOpen = this._isOpen.asReadonly();

  // Load cart from localStorage and normalize items
  loadCart(): void {
    const cart = localStorage.getItem('cart');
    const parsedCart = cart ? JSON.parse(cart) : [];
    if (cart) {
      const cartItems: Cart[] = parsedCart.map((item: any) => ({
        id: Number(item.id),
        title: String(item.title),
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: String(item.image),
      }));
      this._cart.set(cartItems);
    }
  }

  setIsOpen(state: boolean): void {
    this._isOpen.set(state);
  }

  // Create a new cart item from a product in the shop
  createCart(product: Product): Cart {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.image,
    };
  }

  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart()));
  }

  // Calculate total price, with discount for authenticated users
  getTotal(): number {
    const total = this.cart().reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );

    if (this.userService.isAuthenticated()) {
      return total * (1 - 15 / 100);
    } else {
      return total;
    }
  }

  private updateQuantity(id: number, delta: number): void {
    const cart = [...this.cart()];
    const product = cart.find((p) => p.id === id);
    if (!product) return;

    product.quantity += delta;

    if (product.quantity < 1) {
      this.removeProduct(id);
    } else {
      this._cart.set(cart);
      this.saveCart();
    }
  }

  decreaseQuantity(id: number): void {
    this.updateQuantity(id, -1);
  }

  incrementQuantity(id: number): void {
    this.updateQuantity(id, 1);
  }

  // Add product to cart or increment if already exists
  addProduct(product: Cart) {
    const cart = [...this.cart()];
    const getProduct = cart.find((p) => p.id === product.id);

    if (getProduct) {
      getProduct.quantity++;
    } else {
      cart.push({ ...product, quantity: product.quantity || 1 });
    }

    this._cart.set(cart);
    this.saveCart();
  }

  removeProduct(id: number): void {
    this._cart.set(this.cart().filter((p) => p.id !== id));
    this.saveCart();
  }

  // Save current cart to sessionStorage for invoice and clear cart
  checkout(): void {
    const tempCart = this.cart();

    sessionStorage.setItem('tempCart', JSON.stringify(tempCart));
    this._cart.set([]);
    localStorage.removeItem('cart');
  }
}
