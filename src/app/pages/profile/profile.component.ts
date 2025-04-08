import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ProfileComponent {
  user = {
    name: 'Daniel',
    email: 'daniel@email.com',
    password: '',
    avatar: 'https://i.pravatar.cc/150?img=12'
  };

  hidePassword = true;

  onSave() {
    console.log('Dados atualizados:', this.user);
    alert('Perfil salvo com sucesso!');
  }
}
