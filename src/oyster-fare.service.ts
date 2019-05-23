import { Fares, Transport } from './oyster.models';

export class FareService {
    private static _fareServiceInstance: FareService;
    private _maxTubeFare: number = 0;
    private _maxBusFare = Fares.BusFare;

    private constructor() {}

    public static get Instance() {
        // following Singleton pattern
        return this._fareServiceInstance || (this._fareServiceInstance = new this());
    }

    getMaxFare(transport: Transport) {
        /* for Bus */
        if (transport === Transport.Bus) {
            return this._maxBusFare;
        }

        /* for Tube Transport */
        // for first time, it will calculate max fare, next time it will return saved max fare
        if (!this._maxTubeFare) {
            // gettting all fare list
            const fares = Object.keys(Fares)
                // filtering all fares as numbers
                .filter(k => typeof Fares[k as any] === 'string')
                // sorting all prices to get max
                .sort();

            // after sorting, array last price would be max one
            this._maxTubeFare = parseFloat(fares[fares.length - 1]);
        }

        // calculating max fare out of all fares
        return this._maxTubeFare;
    }
}
