import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { DeleteComponent } from './delete/delete.component';
import { EditComponent } from './edit/edit.component';
import { IUser } from '../../shared/types/IUser';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  displayedColumns: string[] = ['name', 'department', 'phone', 'email', 'permission', 'actions'];
  users: IUser[] = [
    { id: 1, name: 'João Silva', department: 'TI', phone: '11999999999', email: 'joao@email.com', permission: 'Admin', active: true },
    { id: 2, name: 'Maria Santos', department: 'RH', phone: '11888888888', email: 'maria@email.com', permission: 'Usuário', active: true },
  ];

  constructor(private dialog: MatDialog) { }

  createUser() {
    const dialogRef = this.dialog.open(AddComponent, {
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;

        const newUser = {
          ...result,
          id: newId,
          active: true
        };

        this.users = [...this.users, newUser];
      }
    });
  }

  editUser(user: IUser) {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '700px',
      data: user,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          const updatedUser = {
            ...result,
            id: user.id,
            active: user.active
          };

          this.users = [
            ...this.users.slice(0, index),
            updatedUser,
            ...this.users.slice(index + 1)
          ];
        }
      }
    });
  }

  deleteUser(userId: number, userName: string) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '300px',
      data: { userId, userName }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.users = this.users.filter(user => user.id !== userId);
      }
    });
  }

  toggleActive(user: IUser) {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      const updatedUser = {
        ...user,
        active: !user.active
      };

      this.users = [
        ...this.users.slice(0, index),
        updatedUser,
        ...this.users.slice(index + 1)
      ];
    }
  }
}