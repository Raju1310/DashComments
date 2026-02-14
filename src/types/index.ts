export type ScreenName =
  | 'GATEWAY'
  | 'VOUCHER_ENTRY'
  | 'GROUP_LIST'
  | 'LEDGER_LIST'
  | 'TRIAL_BALANCE'
  | 'DAY_BOOK'
  | 'LEDGER_STATEMENT'
  | 'BALANCE_SHEET'
  | 'PROFIT_LOSS';

export interface ScreenState {
  name: ScreenName;
  props?: Record<string, any>;
}
