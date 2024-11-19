import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Login } from '../model/login.model';
import { USER } from '../../../shared/constants';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'xp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenStorage: TokenStorage,
    private snackBarService: MatSnackBar
  ) { }

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get username() { return this.loginForm.get('username') }

  get password() { return this.loginForm.get('password') }

  openSnackBar(message: string): void {
    this.snackBarService.open(message, "OK", { duration: 5000 })
  }

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
        error: (err) => {
          this.openSnackBar("Invalid username or password.")
        },
      });
    }
  }


}

