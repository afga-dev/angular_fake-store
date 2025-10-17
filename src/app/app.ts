import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected user = inject(UserService);
  protected router = inject(Router);

  ngOnInit(): void {
    this.user.getUserFromLocalStorage();
  }

  onSignOut() {
    this.user.onSignOut();
    this.router.navigateByUrl('/signin');
  }
}
