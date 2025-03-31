import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  opened: boolean = true;
  contentMargin: number = 250;
  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone, private authService: AuthService, private router: Router) { }

  toggleSidenav() {
    this.opened = !this.opened;

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.contentMargin = this.opened ? 250 : 64;
          this.cdr.detectChanges();
        });
      }, 10);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}