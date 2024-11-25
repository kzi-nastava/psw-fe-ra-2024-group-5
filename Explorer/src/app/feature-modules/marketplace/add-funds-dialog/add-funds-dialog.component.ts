import { Component, Inject } from '@angular/core';
import { MatDialogRef , MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Account } from '../../administration/model/account.model';
import { MarketplaceService } from '../marketplace.service';
import { Money } from 'src/app/shared/model/money';

@Component({
  selector: 'xp-add-funds-dialog',
  templateUrl: './add-funds-dialog.component.html',
  styleUrls: ['./add-funds-dialog.component.css']
})
export class AddFundsDialogComponent {

  amount: number | null = null;
  amountError: boolean = false;
  account: Account;
  currencies: string[] = ['AC', 'EUR', 'DOL', 'RSD']
  getCurrencyName(currencyNum: number | undefined){
    if(!currencyNum)
      return 'AC'
    else
      return this.currencies[currencyNum]
  }

  selectedCurrency: string = '0';

  constructor(public dialogRef: MatDialogRef<AddFundsDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) private data: Account,
    private marketService: MarketplaceService){

      if (this.data) {
        this.account = this.data;
      }
  }


  validateAmount(): boolean {
    if (this.amount === null || this.amount < 0) {
      this.amountError = true;
      console.log(this.amountError)
      return false;
    } 

    this.amountError = false;
    return true;
  }

  closeDialog(): void{
    this.dialogRef.close();
  }

  addFunds(): void{
    if(!this.validateAmount()){
      return;
    }

    if(!this.account || !this.amount || !this.account.id){
      return;
    }

    const money: Money = {
      amount : this.amount,
      currency: Number(this.selectedCurrency)
    }

    this.marketService.addFunds(money, this.account.id).subscribe({
      next: (response) => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.dialogRef.close(false);
      },
    });
  }

  chips: Money[] = [{amount: 500, currency: 0}, {amount: 1000, currency: 0},
    {amount: 10, currency: 1}, {amount: 10, currency: 2}, {amount: 1000, currency: 3}];

  onChipClick(chip: Money) {
    this.amount = chip.amount;
    this.selectedCurrency = `${chip.currency}`;
  }
}
