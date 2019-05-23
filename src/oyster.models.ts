export enum Transport {
    Bus = 0,
    Tube = 1,
}

export enum Zone {
    ZONE1 = 1,
    ZONE2,
    ZONE3,
    ZONE4,
}

export interface StationType {
    name: string;
    zone: Zone | Zone[]; // since one station could come under multiple zones e.g Earl's Court
}

export enum Fares {
    AnywhereInZone1 = 2.5,
    AnyoneZoneOutsideZone1 = 2,
    AnyTwoZonesIncZone1 = 3,
    AnyTwoZonesExcZone1 = 2.25,
    AnyThreeZone = 3.2,
    SpecialZoneFare = 2.5,
    BusFare = 1.8,
}

export enum CardPunchStatus {
    None,
    CheckIn,
    CheckOut,
}

export const Stations: any = {
    /* STATION_CODE: { STATION_NAME, ZONE } */
    HOL: { name: 'Holborn', zone: Zone.ZONE1 },
    ECT: { name: 'Earl’s Court', zone: [Zone.ZONE1, Zone.ZONE2] },
    WDN: { name: 'Wimbledon', zone: Zone.ZONE3 },
    HMT: { name: 'Hammersmith', zone: Zone.ZONE2 },
};
