import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-add',
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
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {
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

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddComponent>) {
    this.demandForm = this.fb.group({
      requestorName: ['', [Validators.required, Validators.minLength(3)]],
      department: ['', Validators.required],
      origin: ['', Validators.required],
      zone: ['', Validators.required],
      neighborhood: ['', Validators.required],
      address: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      phone: ['', [Validators.required, Validators.pattern('^\\+?[1-9][0-9]{7,14}$')]],
      observation: [''],
      registrationDate: [new Date(), Validators.required],
      priority: ['', Validators.required],
      estimatedStartDays: ['', [Validators.required, Validators.min(1)]],
      estimatedTime: ['', Validators.required],
      completionDate: [''],
      status: ['Criada', Validators.required],
      approved: [false],
      justification: ['']
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

    this.demandForm.get('zone')?.valueChanges.subscribe(selectedZone => {
      this.demandForm.get('neighborhood')?.setValue('');

      if (selectedZone === 'Rural') {
        this.availableNeighborhoods = this.ruralNeighborhoods;
      } else if (selectedZone === 'Urbana') {
        this.availableNeighborhoods = this.urbanNeighborhoods;
      } else {
        this.availableNeighborhoods = [];
      }
    });
  }

  submitForm() {
    if (this.demandForm.valid) {
      console.log('Demanda Criada:', this.demandForm.value);
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