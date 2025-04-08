import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeleteComponent } from './delete/delete.component';
import { EditComponent } from './edit/edit.component';
import { DepartmentHeadEditComponent } from './department-head-edit/department-head-edit.component';
import { AddComponent } from './add/add.component';
import { IDemand } from '../../shared/types/IDemand';

type UserRole = 'fiscal' | 'chefeDepartamento' | 'funcionario';

@Component({
  selector: 'app-demands',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './demands.component.html',
  styleUrl: './demands.component.scss'
})
export class DemandsComponent {
  displayedColumns: string[] = [
    'requestorName',
    'department',
    'neighborhood',
    'priority',
    'status',
    'registrationDate',
    'actions'
  ];
  
  selectedRole: UserRole = 'fiscal';
  
  roles: {value: UserRole, label: string}[] = [
    { value: 'fiscal', label: 'Fiscal' },
    { value: 'chefeDepartamento', label: 'Chefe de Departamento' },
    { value: 'funcionario', label: 'Funcionário' }
  ];

  demands: IDemand[] = [
    {
      id: 1,
      requestorName: 'João Silva',
      department: 'Obras',
      origin: 'Solicitação Externa',
      zone: 'Urbana',
      neighborhood: 'Centro',
      address: 'Rua Principal, 123',
      description: 'Reparo de calçada danificada',
      phone: '11999999999',
      observation: 'Prioridade alta devido ao risco de acidentes',
      priority: 1,
      registrationDate: new Date('2025-03-25'),
      estimatedStartDays: 3,
      estimatedTime: '2 dias',
      completionDate: null,
      status: 'Pendente',
      approved: true,
      justification: '',
      active: true
    },
    {
      id: 2,
      requestorName: 'Maria Santos',
      department: 'Meio Ambiente',
      origin: 'Denúncia',
      zone: 'Rural',
      neighborhood: 'Vale Verde',
      address: 'Estrada do Vale, km 5',
      description: 'Descarte irregular de lixo',
      phone: '11888888888',
      observation: '',
      priority: 2,
      registrationDate: new Date('2025-03-28'),
      estimatedStartDays: 5,
      estimatedTime: '3 dias',
      completionDate: null,
      status: 'Criada',
      approved: false,
      justification: 'Aguardando confirmação da localização exata',
      active: true
    },
  ];

  constructor(private dialog: MatDialog) {
    this.updateDisplayedColumns();
  }
  
  updateDisplayedColumns() {
    if (this.selectedRole === 'funcionario') {
      this.displayedColumns = [
        'requestorName',
        'department',
        'neighborhood',
        'priority',
        'status',
        'registrationDate'
      ];
    } else {
      this.displayedColumns = [
        'requestorName',
        'department',
        'neighborhood',
        'priority',
        'status',
        'registrationDate',
        'actions'
      ];
    }
  }
  
  onRoleChange() {
    this.updateDisplayedColumns();
  }

  createDemand() {
    const dialogRef = this.dialog.open(AddComponent, {
      width: '900px',
      height: '850px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newId = this.demands.length > 0 ? Math.max(...this.demands.map(d => d.id)) + 1 : 1;

        const newDemand = {
          ...result,
          id: newId,
          active: true
        };

        this.demands = [...this.demands, newDemand];
      }
    });
  }

  editDemand(demand: IDemand) {
    if (this.selectedRole === 'chefeDepartamento') {
      this.openDepartmentHeadEditModal(demand);
    } else {
      this.openFiscalEditModal(demand);
    }
  }
  
  openFiscalEditModal(demand: IDemand) {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '900px',
      height: '850px',
      data: demand,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.demands.findIndex(d => d.id === demand.id);
        if (index !== -1) {
          const updatedDemand = {
            ...result,
            id: demand.id,
            active: demand.active
          };

          this.demands = [
            ...this.demands.slice(0, index),
            updatedDemand,
            ...this.demands.slice(index + 1)
          ];
        }
      }
    });
  }
  
  openDepartmentHeadEditModal(demand: IDemand) {
    const dialogRef = this.dialog.open(DepartmentHeadEditComponent, {
      width: '700px',
      height: '650px',
      data: demand,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.demands.findIndex(d => d.id === demand.id);
        if (index !== -1) {
          const updatedDemand = {
            ...demand,
            ...result,
            id: demand.id,
            active: demand.active
          };

          this.demands = [
            ...this.demands.slice(0, index),
            updatedDemand,
            ...this.demands.slice(index + 1)
          ];
        }
      }
    });
  }

  deleteDemand(demandId: number, demandName: string) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '300px',
      data: {
        id: demandId,
        name: demandName,
        type: 'demanda' // Para personalizar a mensagem no componente de exclusão
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.demands = this.demands.filter(demand => demand.id !== demandId);
      }
    });
  }

  toggleActive(demand: IDemand) {
    const index = this.demands.findIndex(d => d.id === demand.id);
    if (index !== -1) {
      const updatedDemand = {
        ...demand,
        active: !demand.active
      };

      this.demands = [
        ...this.demands.slice(0, index),
        updatedDemand,
        ...this.demands.slice(index + 1)
      ];
    }
  }

  getPriorityLabel(priority: number): string {
    switch (priority) {
      case 1: return 'Urgente';
      case 2: return 'Alto';
      case 3: return 'Médio';
      case 4: return 'Baixo';
      default: return '-';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Concluída': return 'green';
      case 'Em Andamento': return 'blue';
      case 'Pendente': return 'orange';
      case 'Paralisada': return 'red';
      case 'Cancelada': return 'gray';
      case 'Recusada': return 'darkred';
      default: return 'black';
    }
  }
}