import { Component, OnInit } from '@angular/core';
import { Account } from '../model/account.model';
import { MatTableModule } from '@angular/material/table';
import { AdministrationService } from '../administration.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'xp-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent implements OnInit {
  
  constructor(private administrationService: AdministrationService) {}

  displayedColumns: string[] = [ 'username', 'email', 'role', 'status', 'action'];
  accounts: Account[] = []

  ngOnInit(): void {
    this.administrationService.getAccounts().subscribe(
      (data) => this.accounts = data.results,
      (error) => console.error(error)
    )
  }

  blockAccount(account: Account): void {
    this.administrationService.blockAccount(account).subscribe(
      _ => {
        alert(`User ${account.username} successfuly blocked.`)
        this.ngOnInit()
      },
      (error) => console.error(error)
    )
  }
}
