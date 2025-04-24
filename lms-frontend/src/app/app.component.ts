import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'lms-frontend';
  loading: boolean = true;
  constructor(private router: Router, private auth: AuthService) {
    setTimeout(() => {
      this.loading = false;
      const user = this.auth.getUser();

      if (user && user.role === 'student') {
        this.router.navigate(['/courses']); // send to course listing
      } else {
        this.router.navigate(['/welcome']); // send to landing
      }
    }, 1500); // splash screen delay
  }
}
