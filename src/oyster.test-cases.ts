import { Stations, Transport } from './oyster.models';
import { OysterService } from './oyster.service';
import { OysterCard } from './oyster-card';

export class TestCases {
    private _oysterService: OysterService;
    private _oysterCard: OysterCard;
    constructor(oysterService: OysterService, userOysterCard: OysterCard) {
        this._oysterService = oysterService;
        this._oysterCard = userOysterCard;
    }
    /* UseCase - As described in problem statement */
    firstUseCase() {
        // First Journey
        this._oysterService.checkInBarrier(this._oysterCard, Stations.HOL, Transport.Tube);
        this._oysterService.checkOutBarrier(this._oysterCard, Stations.ECT, Transport.Tube);

        // Second Journey
        this._oysterService.checkInBarrier(this._oysterCard, Stations.WDN, Transport.Bus);
        this._oysterService.checkOutBarrier(this._oysterCard, Stations.ECT, Transport.Bus);

        // Third Journey
        this._oysterService.checkInBarrier(this._oysterCard, Stations.ECT, Transport.Tube);
        this._oysterService.checkOutBarrier(this._oysterCard, Stations.HMT, Transport.Tube);
    }

    // UseCase - When user travels in only one zone outside of zone one
    secondUseCase() {
        this._oysterService.checkInBarrier(this._oysterCard, Stations.HMT, Transport.Tube);
        this._oysterService.checkOutBarrier(this._oysterCard, Stations.HMT, Transport.Tube);
    }

    // UseCase - When user travels in any zone except favourable station zone (excluding Earl's court)
    thirdUseCase() {
        this._oysterService.checkInBarrier(this._oysterCard, Stations.HMT, Transport.Tube);
        this._oysterService.checkOutBarrier(this._oysterCard, Stations.WDN, Transport.Tube);
    }

    // UseCase - when user jumps the first checkIn barrier and punch the card at checkout barrier
    fourthUseCase() {
        // display invalid passage msg
        this._oysterService.checkOutBarrier(this._oysterCard, Stations.HMT, Transport.Tube);
    }
}
