import { OysterCard } from './oyster-card';
import { FareService } from './oyster-fare.service';
import { Transport, StationType, Zone, Fares, CardPunchStatus } from './oyster.models';

export class OysterService {
    private static _appInstance: OysterService;
    private _fareService: FareService;
    private constructor() {
        this._fareService = FareService.Instance;
    }
    public static get Instance() {
        // following Singleton pattern
        return this._appInstance || (this._appInstance = new this());
    }

    /* Check if station occurs in multiple zones or not */
    private _hasMultipleZones(sourceZone: Zone | Zone[], destZone: Zone | Zone[]) {
        // return true when sourceZone or destZone location occurs in multiple zones
        if (Array.isArray(sourceZone) || Array.isArray(destZone)) {
            return true;
        }
        return false;
    }

    /* Getting all travelled zone list for a trip */
    private _flattenAndUniqueZoneList(sourceZone: Zone | Zone[], destZone: Zone | Zone[]) {
        // merging multiple zone list to one unique zone list e.g. [1] -- [1, 2] => [1,1,2]
        let zoneList;
        if (Array.isArray(destZone)) {
            zoneList = destZone.concat(sourceZone);
        } else if (Array.isArray(sourceZone)) {
            zoneList = sourceZone.concat(destZone);
        } else {
            // when both source & destination have distinct zone
            zoneList = [sourceZone, destZone];
        }

        // unique zone list array
        const uniqueZoneList = zoneList.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });

        return uniqueZoneList;
    }

    /* Method to start Journey */
    public checkInBarrier(oysterCard: OysterCard, sourceStation: StationType, transport: Transport) {
        // finding out maxFare as per transport chosen
        const journeyStartPrice = this._fareService.getMaxFare(transport);

        // show error msg if card does not have sufficient balance
        if (!oysterCard.checkBalance(journeyStartPrice)) {
            oysterCard.currentStatus = CardPunchStatus.None;
            console.log('Oops! Card does not have sufficient balance, please recharge');
            return;
        }

        // check-in in oyster system
        oysterCard.currentStatus = CardPunchStatus.CheckIn;
        oysterCard.sourceStation = sourceStation;

        // if card has enough balance, then deduct max fare charges
        const remainingBalance = oysterCard.debitBalance(journeyStartPrice);

        console.log(`Journey Start: £${journeyStartPrice}`);
        // console.log('Remaining balance: ', remainingBalance);
    }

    /* Method to End Journey */
    public checkOutBarrier(oysterCard: OysterCard, destinationStation: StationType, transport: Transport) {
        // first check for invalid passage
        if (oysterCard.currentStatus !== CardPunchStatus.CheckIn) {
            // show the user about invalid journey
            console.log('Invalid passage, please contact to customer support.');
            return;
        }

        // calculate exact price to be charged
        const sourceStationZone = oysterCard.sourceStation.zone;
        const destStationZone = destinationStation.zone;
        let exactJourneyPrice = 0;

        if (transport === Transport.Tube) {
            // CASE 1: Anywhere in zone one case
            if (sourceStationZone === destStationZone && destStationZone === Zone.ZONE1) {
                exactJourneyPrice = Fares.AnywhereInZone1;
            }

            // Case 2: Any one zone outside of zone 1
            if (!this._hasMultipleZones(sourceStationZone, destStationZone) && destStationZone !== Zone.ZONE1 && sourceStationZone === destStationZone) {
                exactJourneyPrice = Fares.AnyoneZoneOutsideZone1;
            }

            // To calculate multiple zones, we need to create unique zone list array
            const uniqueZoneList = this._flattenAndUniqueZoneList(sourceStationZone, destStationZone);

            // Case 3: Any two zones including zone 1
            if (uniqueZoneList.length === 2 && uniqueZoneList.indexOf(Zone.ZONE1) > -1) {
                // special fare for Earl's court since it lies between two zones
                if (this._hasMultipleZones(sourceStationZone, destStationZone)) {
                    // means its favourable station so need to charge less
                    exactJourneyPrice = Fares.SpecialZoneFare;
                } else {
                    exactJourneyPrice = Fares.AnyTwoZonesIncZone1;
                }
            }

            // Case 4: Any two zones excluding zone 1
            if (uniqueZoneList.length === 2 && uniqueZoneList.indexOf(Zone.ZONE1) === -1) {
                exactJourneyPrice = Fares.AnyTwoZonesExcZone1;
            }

            // Case 5: Any three zones
            if (uniqueZoneList.length === 3) {
                exactJourneyPrice = Fares.AnyThreeZone;
            }

            // Credit remaining amount, if debited amount is greater than exact journey price
            if (oysterCard.lastDebittedAmount > exactJourneyPrice) {
                const overChargedAmount = oysterCard.lastDebittedAmount - exactJourneyPrice;
                oysterCard.creditBalance(overChargedAmount);
            }

            // checking out the card
            oysterCard.currentStatus = CardPunchStatus.CheckOut;

            // resetting all card backup info
            oysterCard.resetCardBackup();
        }
        console.log(`Journey End: £${exactJourneyPrice}`);
        console.log('=============================');
        console.log(`Remaining balance: £${oysterCard.getBalanceAmountInfo()}`);
        console.log('=============================');
        console.log('');

        // In case of Bus Transport, since bus fare is same for all journey and we already deducted that amount so just need to checkout card
        oysterCard.currentStatus = CardPunchStatus.CheckOut;
    }
}
