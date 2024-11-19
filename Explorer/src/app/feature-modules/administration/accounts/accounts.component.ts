import { Component, OnInit } from '@angular/core';
import { Account } from '../model/account.model';
import { MatTableModule } from '@angular/material/table';
import { AdministrationService } from '../administration.service';
import { MatButton } from '@angular/material/button';
import { Money } from 'src/app/shared/model/money';
import { Wallet } from '../../marketplace/model/wallet';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { AddFundsDialogComponent } from '../../marketplace/add-funds-dialog/add-funds-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'xp-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent implements OnInit {
  
  constructor(private administrationService: AdministrationService, private marketService: MarketplaceService, public dialog: MatDialog) {}

  displayedColumns: string[] = [ 'username', 'email', 'role', 'status', 'wallet' ,'action'];
  accounts: Account[] = []
  currencies: string[] = ['AC', 'EUR', 'DOL', 'RSD']

  formatWallet(walletBalance: Money): string{
    if(!walletBalance){
      return 'No Wallet';
    }
    
    return `${walletBalance.amount} ${this.currencies[walletBalance.currency]}`;
  }

  ngOnInit(): void {
    this.administrationService.getAccounts().subscribe(
      (data) => {
        this.accounts = data.results;

        this.accounts.forEach(acc => {
          if(acc.role === 'tourist'){
            this.sendWalletRequest(acc);
          }
        });
      },
      (error) => console.error(error)
    )
  }

  sendWalletRequest(account: Account){
    if(!account.id){
      return;
    }

    this.marketService.getWalletByAdmin(account.id).subscribe(
      {
      next: (result: Wallet) => {
        account.walletBalance = result.balance
      },
      error: () => {}
      }
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

  openDialog(id?: number): void{
    const dialogRef = this.dialog.open(AddFundsDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
        console.log('dialog closed')
    });
  }
}
