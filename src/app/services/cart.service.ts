import { Injectable, signal } from '@angular/core';
import { Cart } from '../models/cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
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

  setIsOpen(state: boolean): void {
    this.isOpen.set(state);
  }

  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart()));
  }

  totalCart(): number {
    return this.cart().reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
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
}
