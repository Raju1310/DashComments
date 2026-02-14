import { getDb, saveDb } from '../db/db';
import { v4 as uuidv4 } from 'uuid';

export interface VoucherEntry {
  ledgerId: string;
  amount: number;
  type: 'Dr' | 'Cr';
}

export interface VoucherData {
  type: string;
  date: string;
  narration: string;
  entries: VoucherEntry[];
}

export const transactionService = {
  createVoucher: (data: VoucherData) => {
    const db = getDb();

    // Validate Sum(Dr) === Sum(Cr)
    const totalDr = data.entries.filter(e => e.type === 'Dr').reduce((sum, e) => sum + e.amount, 0);
    const totalCr = data.entries.filter(e => e.type === 'Cr').reduce((sum, e) => sum + e.amount, 0);

    if (totalDr !== totalCr) {
      throw new Error(`Dr Total (${totalDr}) does not match Cr Total (${totalCr})`);
    }

    try {
      db.run("BEGIN TRANSACTION");

      // Auto-assign voucher number (simple count + 1 for now)
      const countRes = db.exec(`SELECT count(*) FROM vouchers WHERE voucher_type = '${data.type}'`);
      const nextNum = (countRes[0].values[0][0] as number) + 1;

      const voucherId = uuidv4();
      const now = Date.now();

      const stmtVoucher = db.prepare(`INSERT INTO vouchers (id, voucher_number, voucher_type, date, narration, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?)`);
      stmtVoucher.run([voucherId, nextNum.toString(), data.type, data.date, data.narration, now, now]);
      stmtVoucher.free();

      // Insert entries and update ledgers
      const stmtEntry = db.prepare(`INSERT INTO voucher_entries (id, voucher_id, ledger_id, amount, type)
                VALUES (?, ?, ?, ?, ?)`);
      const stmtUpdate = db.prepare(`UPDATE ledgers SET current_balance = current_balance + ? WHERE id = ?`);

      for (const entry of data.entries) {
        const entryId = uuidv4();
        stmtEntry.run([entryId, voucherId, entry.ledgerId, entry.amount, entry.type]);

        // Update Ledger Balance
        const natureRes = db.exec(`
            SELECT g.nature
            FROM ledgers l
            JOIN account_groups g ON l.group_id = g.id
            WHERE l.id = '${entry.ledgerId}'
        `);

        let nature = 'Asset';
        if (natureRes.length > 0 && natureRes[0].values.length > 0) {
            nature = natureRes[0].values[0][0] as string;
        }

        let change = 0;
        // Logic:
        // Assets/Expenses (Debit Nature): Dr increases (+), Cr decreases (-)
        // Liabilities/Incomes (Credit Nature): Cr increases (+), Dr decreases (-)
        if (nature === 'Asset' || nature === 'Expense') {
            change = entry.type === 'Dr' ? entry.amount : -entry.amount;
        } else {
            // Usually liabilities store positive credit balance.
            change = entry.type === 'Cr' ? entry.amount : -entry.amount;
        }

        stmtUpdate.run([change, entry.ledgerId]);
      }

      stmtEntry.free();
      stmtUpdate.free();

      db.run("COMMIT");
      saveDb();
      return voucherId;

    } catch (e) {
      db.run("ROLLBACK");
      throw e;
    }
  }
};
