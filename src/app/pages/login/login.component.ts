import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { PanelComponent } from '../../shared/components/panel/panel.component';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PanelComponent, CommonModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router) { }


  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });
  }

  login() {
    this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        alert("E-mail ou senha inválidos!")
      }
    });
  }

  register() {
    this.authService.signupUser(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: () => {
        alert("Usuário cadastrado!")
      },
      error: (err) => {
        console.log("Erro ao cadastrar: " + JSON.stringify(err));
      }
    });
  }
}
