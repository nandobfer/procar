export interface CurrencyRate {
    symbol: string;
    updatedAt: string;
    id: number;
    name: string;
    code: string;
    base: string;
    rate: number;
}
declare class ExchangeRateAPI {
    api: import("axios").AxiosInstance;
    base: string;
    currencies: string;
    rates: CurrencyRate[];
    static isExpired(timestamp: string | number): boolean;
    constructor();
    init(): Promise<void>;
    getRates(): Promise<CurrencyRate[]>;
}
export declare const exchangeRateAPI: ExchangeRateAPI;
export {};
