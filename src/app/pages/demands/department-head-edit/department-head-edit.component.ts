import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IDemand } from '../../../shared/types/IDemand';

@Component({
  selector: 'app-department-head-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatCheckboxModule,
  ],
  templateUrl: './department-head-edit.component.html',
  styleUrl: './department-head-edit.component.scss'
})
export class DepartmentHeadEditComponent {
  demandForm: FormGroup;

  statuses = [
    'Criada',
    'Pendente',
    'Em Andamento',
    'Entregue',
    'Concluída',
    'Cancelada',
    'Recusada',
    'Paralisada'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DepartmentHeadEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDemand
  ) {
    this.demandForm = this.fb.group({
      status: [data.status, Validators.required],
      approved: [data.approved],
      justification: [data.justification],
      completionDate: [data.completionDate]
    });

    this.demandForm.get('approved')?.valueChanges.subscribe(value => {
      const justificationControl = this.demandForm.get('justification');
      if (!value) {
        justificationControl?.setValidators([Validators.required]);
      } else {
        justificationControl?.clearValidators();
      }
      justificationControl?.updateValueAndValidity();
    });

    if (!data.approved) {
      this.demandForm.get('justification')?.setValidators([Validators.required]);
      this.demandForm.get('justification')?.updateValueAndValidity();
    }
  }

  submitForm() {
    if (this.demandForm.valid) {
      console.log('Demanda Atualizada pelo Chefe:', this.demandForm.value);
      this.dialogRef.close(this.demandForm.value);
    } else {
      Object.keys(this.demandForm.controls).forEach(key => {
        this.demandForm.get(key)?.markAsTouched();
      });
      console.log('Formulário inválido');
    }
  }

  close() {
    this.dialogRef.close();
  }
}