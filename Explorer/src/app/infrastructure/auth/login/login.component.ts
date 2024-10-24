import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Login } from '../model/login.model';
import { USER } from '../../../shared/constants';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service'; 


@Component({
  selector: 'xp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenStorage: TokenStorage
  ) {}

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  login(): void {
    const login: Login = {
      username: this.loginForm.value.username || "",
      password: this.loginForm.value.password || "",
    };

    if (this.loginForm.valid) {
      this.authService.login(login).subscribe({
        next: (response) => {
          const userId = response.id;
          this.tokenStorage.saveAccessToken(response.accessToken);  
          localStorage.setItem(USER, userId.toString());
          this.router.navigate(['/']);
        },
      });
    }
  }
}
