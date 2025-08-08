export type Market = { market: string; korean_name: string; english_name: string; market_warning?: "NONE" | "CAUTION" };
export type Ticker = {
    market: string;
    trade_price: number;
    acc_trade_price_24h: number;
    change: "RISE" | "EVEN" | "FALL";
    high_price: number;
    low_price: number;
    prev_closing_price: number;
    signed_change_price: number;
    signed_change_rate: number;
    trade_date_kst: string;
    trade_time_kst: string;
};
export type Trade = {
    market: string;
    trade_price: number;
    trade_volume: number;
    ask_bid: "ASK" | "BID";
    trade_timestamp: number;
    sequential_id: number;
};
export type OrderbookUnit = { ask_price: number; bid_price: number; ask_size: number; bid_size: number };
export type Orderbook = {
    market: string;
    timestamp: number;
    total_ask_size: number;
    total_bid_size: number;
    orderbook_units: OrderbookUnit[];
};

export type CandleMinute = {
    market: string;
    candle_date_time_kst: string;
    opening_price: number;
    high_price: number;
    low_price: number;
    trade_price: number;
    candle_acc_trade_price: number;
    candle_acc_trade_volume: number;
    unit: number;
};
export type CandleDay = Omit<CandleMinute, "unit"> & { prev_closing_price: number; change: "RISE" | "EVEN" | "FALL" };
export type CandleWeek = CandleDay;
export type CandleMonth = CandleDay;

export type Balance = {
    currency: string;
    balance: string;
    locked: string;
    avg_buy_price: string;
    avg_buy_price_modified: boolean;
    unit_currency: string;
};

export type OrderSide = "bid" | "ask";
export type OrderType = "limit" | "price" | "market" | "best";
export type TimeInForce = "ioc" | "fok" | undefined;
export type SmpType = "none" | "cancel_newest" | "cancel_oldest" | "reject_new" | "reject_old";

export type PlaceOrderReq = {
    market: string;
    side: OrderSide;
    volume?: string; // 수량
    price?: string; // KRW 금액
    ord_type: OrderType;
    time_in_force?: TimeInForce; // ioc/fok
    identifier?: string; // 클라 식별자
    smp_type?: SmpType; // Self-Match Prevention
};

export type Order = {
    uuid: string;
    side: OrderSide;
    ord_type: OrderType;
    price: string | null;
    state: string;
    market: string;
    created_at: string;
    volume: string;
    remaining_volume: string;
    reserved_fee: string;
    remaining_fee: string;
    paid_fee: string;
    locked: string;
    executed_volume: string;
    trades_count: number;
};

export type Deposit = { currency: string; amount: string; txid: string | null; state: string; created_at: string };
export type Withdrawal = {
    currency: string;
    amount: string;
    fee: string;
    txid: string | null;
    state: string;
    created_at: string;
};
export type WalletAddress = { currency: string; deposit_address: string; secondary_address?: string | null };
