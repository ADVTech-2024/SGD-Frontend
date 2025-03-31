import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatButtonModule, MatSelectModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {
  userForm: FormGroup;
  permissions = ['Admin', 'Gerente', 'Usuário'];

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddComponent>) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      department: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^\\+?[1-9][0-9]{7,14}$')]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      permission: ['', Validators.required]
    });
  }

  submitForm() {
    if (this.userForm.valid) {
      console.log('Usuário Criado:', this.userForm.value);
      this.dialogRef.close(this.userForm.value);
    } else {
      console.log('Formulário inválido');
    }
  }

  close() {
    this.dialogRef.close();
  }
}