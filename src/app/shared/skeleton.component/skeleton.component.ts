import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.css',
})
export class SkeletonComponent {
  count = input(20);

  placeholders = signal<number[]>([]);

  constructor() {
    this.updatePlaceholders();
  }

  private updatePlaceholders() {
    this.placeholders.set(Array.from({ length: this.count() }, (_, i) => i));
  }
}
