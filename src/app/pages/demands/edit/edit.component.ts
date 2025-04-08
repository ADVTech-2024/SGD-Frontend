import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IDemand } from '../../../shared/types/IDemand';

@Component({
  selector: 'app-edit-demand',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  demandForm: FormGroup;

  departments = ['Obras', 'Saúde', 'Educação', 'Segurança', 'Administração', 'Meio Ambiente'];
  zones = ['Rural', 'Urbana'];
  priorities = [
    { value: 1, label: '1 - Urgente' },
    { value: 2, label: '2 - Alto' },
    { value: 3, label: '3 - Médio' },
    { value: 4, label: '4 - Baixo' }
  ];
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

  ruralNeighborhoods = [
    'Monte Alegre',
    'Baixa Alegre',
    'Brongo',
    'Água Preta',
    'Taararanga',
    'Paó',
    'Jericó'
  ];

  urbanNeighborhoods = [
    'Emília Costa',
    'Polivalente',
    'Centro',
    'Beira Rio',
    '2 de Julho',
    'Renovação',
    'Teotônio Calheira',
    'Eliseu Leal',
    'Leonel',
    'Jardim Gandu'
  ];

  availableNeighborhoods: string[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDemand
  ) {
    this.demandForm = this.fb.group({
      requestorName: [data.requestorName, [Validators.required, Validators.minLength(3)]],
      department: [data.department, Validators.required],
      origin: [data.origin, Validators.required],
      zone: [data.zone, Validators.required],
      neighborhood: [data.neighborhood, Validators.required],
      address: [data.address, Validators.required],
      description: [data.description, [Validators.required, Validators.minLength(10)]],
      phone: [data.phone, [Validators.required, Validators.pattern('^\\+?[1-9][0-9]{7,14}$')]],
      observation: [data.observation],
      priority: [data.priority, Validators.required],
      registrationDate: [data.registrationDate, Validators.required],
      estimatedStartDays: [data.estimatedStartDays, [Validators.required, Validators.min(1)]],
      estimatedTime: [data.estimatedTime, Validators.required],
      completionDate: [data.completionDate],
      approved: [data.approved],
      status: [data.status, Validators.required],
      justification: [data.justification]
    });

    this.updateNeighborhoodOptions(data.zone);

    this.demandForm.get('zone')?.valueChanges.subscribe(selectedZone => {
      this.updateNeighborhoodOptions(selectedZone);
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

  updateNeighborhoodOptions(selectedZone: string) {
    if (selectedZone === 'Rural') {
      this.availableNeighborhoods = this.ruralNeighborhoods;
    } else if (selectedZone === 'Urbana') {
      this.availableNeighborhoods = this.urbanNeighborhoods;
    } else {
      this.availableNeighborhoods = [];
    }

    const currentNeighborhood = this.demandForm.get('neighborhood')?.value;
    if (currentNeighborhood && !this.availableNeighborhoods.includes(currentNeighborhood)) {
      this.demandForm.get('neighborhood')?.setValue('');
    }
  }

  submitForm() {
    if (this.demandForm.valid) {
      console.log('Demanda Editada:', this.demandForm.value);
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