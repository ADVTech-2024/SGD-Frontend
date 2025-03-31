import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatButtonModule, MatSelectModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  userForm: FormGroup;
  permissions = ['Admin', 'Gerente', 'Usuário'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any  // Recebe os dados do usuário para edição
  ) {
    this.userForm = this.fb.group({
      name: [data.name, [Validators.required, Validators.minLength(3)]],
      department: [data.department, Validators.required],
      phone: [data.phone, [Validators.required, Validators.pattern('^\\+?[1-9][0-9]{7,14}$')]],
      email: [data.email, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      permission: [data.permission, Validators.required]
    });
  }

  submitForm() {
    if (this.userForm.valid) {
      console.log('Usuário Editado:', this.userForm.value);
      this.dialogRef.close(this.userForm.value);
    } else {
      console.log('Formulário inválido');
    }
  }

  close() {
    this.dialogRef.close();
  }
}