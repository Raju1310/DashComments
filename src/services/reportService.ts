import { getDb } from '../db/db';

export interface TrialBalanceEntry {
  ledgerId: string;
  ledgerName: string;
  groupName: string;
  nature: string;
  balance: number;
}

export interface DayBookEntry {
  id: string;
  date: string;
  voucherNumber: string;
  voucherType: string;
  ledgerName: string;
  amount: number;
  type: string;
}

export interface LedgerStatementEntry {
  date: string;
  voucherType: string;
  voucherNumber: string;
  particulars: string;
  debit: number | null;
  credit: number | null;
  balance: number;
}

export const reportService = {
  getTrialBalance: () => {
    const db = getDb();
    const result = db.exec(`
      SELECT
        l.id, l.name, g.name as group_name, g.nature, l.current_balance
      FROM ledgers l
      JOIN account_groups g ON l.group_id = g.id
      WHERE l.current_balance != 0
      ORDER BY g.path, l.name
    `);

    if (result.length === 0) return [];

    return result[0].values.map((row: any) => ({
      ledgerId: row[0],
      ledgerName: row[1],
      groupName: row[2],
      nature: row[3],
      balance: (row[4] as number) / 100 // Convert paisa to unit
    }));
  },

  getDayBook: () => {
     const db = getDb();
     // Get Vouchers
     const result = db.exec(`
        SELECT
            v.id, v.date, v.voucher_number, v.voucher_type,
            (SELECT sum(amount) FROM voucher_entries WHERE voucher_id = v.id AND type = 'Dr') as amount
        FROM vouchers v
        ORDER BY v.date DESC, v.created_at DESC
     `);

     if (result.length === 0) return [];

     return result[0].values.map((row: any) => ({
         id: row[0],
         date: row[1],
         voucherNumber: row[2],
         voucherType: row[3],
         ledgerName: 'Multiple',
         amount: (row[4] as number) / 100, // Convert paisa to unit
         type: 'Dr'
     }));
  },

  getLedgerStatement: (ledgerId: string) => {
      const db = getDb();

      // Get opening balance and nature
      const obRes = db.exec(`SELECT opening_balance, (SELECT nature FROM account_groups WHERE id = ledgers.group_id) FROM ledgers WHERE id = '${ledgerId}'`);
      let runningBalance = 0;
      let nature = 'Asset';

      if (obRes.length > 0) {
          runningBalance = obRes[0].values[0][0] as number; // Already in paisa
          nature = obRes[0].values[0][1] as string;
      }

      // Get entries
      const result = db.exec(`
        SELECT
            v.date, v.voucher_type, v.voucher_number, ve.amount, ve.type
        FROM voucher_entries ve
        JOIN vouchers v ON ve.voucher_id = v.id
        WHERE ve.ledger_id = '${ledgerId}'
        ORDER BY v.date, v.created_at
      `);

      if (result.length === 0) return [];

      return result[0].values.map((row: any) => {
          const amount = row[3] as number; // In paisa
          const type = row[4] as string;

          let change = 0;
          if (nature === 'Asset' || nature === 'Expense') {
              change = type === 'Dr' ? amount : -amount;
          } else {
              change = type === 'Cr' ? amount : -amount;
          }

          runningBalance += change;

          return {
              date: row[0],
              voucherType: row[1],
              voucherNumber: row[2],
              particulars: 'To/By ...',
              debit: type === 'Dr' ? amount / 100 : null,
              credit: type === 'Cr' ? amount / 100 : null,
              balance: runningBalance / 100
          };
      });
  }
};
