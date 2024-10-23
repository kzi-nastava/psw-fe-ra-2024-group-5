import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { MatDialog } from '@angular/material/dialog';
import { TourEquipmentDialogComponent } from '../../tour-authoring/tour-equipment-dialog/tour-equipment-dialog.component';

@Component({
  selector: 'xp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User | undefined;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  openTourEquipmentDialog(): void {
    this.dialog.open(TourEquipmentDialogComponent, {
      width: '500px',
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
