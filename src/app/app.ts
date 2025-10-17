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
  protected router = inject(Router);
  protected userService = inject(UserService);

  ngOnInit(): void {
    this.userService.getUserFromLocalStorage();
  }

  onSignOut() {
    this.userService.onSignOut();
    this.router.navigateByUrl('/signin');
  }
}
