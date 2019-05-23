import { CardPunchStatus } from './oyster.models';

export class OysterCard {
    // card identity number
    private _id: number;

    // card balance amount
    private _balanceAmount: number = 0;
    private _lastDebitedAmount: number = 0;
    public currentStatus = CardPunchStatus.None;
    public sourceStation: any;
    public destinationStation: any;

    constructor(initialAmount = 30) {
        // register card with 30$ amount
        this._id = this._generateCardNumber();
        this._balanceAmount = initialAmount;
    }

    private _generateCardNumber(): number {
        return Math.floor(Math.random() * 1000000) + 1;
    }

    // to credit amount to balance
    public creditBalance(amount: number) {
        this._balanceAmount += amount;
    }

    // to debit amount from balance
    public debitBalance(amount: number) {
        // to keep track of last amount deducted for future calculations
        this._lastDebitedAmount = amount;
        // return remaining balance
        return this.checkBalance(amount) ? (this._balanceAmount -= amount) : this._balanceAmount;
    }

    // to get balance amount details
    public getBalanceAmountInfo(): number {
        return this._balanceAmount;
    }

    // check balance if it has sufficient bal to be deducted
    public checkBalance(amount: number) {
        // will return true if it has balance, otherwise will return false
        return this._balanceAmount - amount >= 0;
    }

    get lastDebittedAmount() {
        return this._lastDebitedAmount;
    }

    public resetCardBackup() {
        this._lastDebitedAmount = 0;
        this.currentStatus = CardPunchStatus.None;
        this.sourceStation = null;
    }
}
