import { getDb, saveDb } from '../db/db';
import { v4 as uuidv4 } from 'uuid';

export interface Group {
  id: string;
  name: string;
  parent_group_id: string | null;
  nature: string;
  path: string;
}

export interface Ledger {
  id: string;
  name: string;
  group_id: string;
  opening_balance: number;
  current_balance: number;
}

export const masterService = {
  getGroups: (): Group[] => {
    const db = getDb();
    const result = db.exec("SELECT * FROM account_groups ORDER BY path");
    if (!result.length) return [];

    return result[0].values.map((row: any) => ({
      id: row[0],
      name: row[1],
      parent_group_id: row[2],
      nature: row[3],
      path: row[4]
    }));
  },

  getLedgers: (): Ledger[] => {
    const db = getDb();
    const result = db.exec("SELECT * FROM ledgers ORDER BY name");
    if (!result.length) return [];

    return result[0].values.map((row: any) => ({
      id: row[0],
      name: row[1],
      group_id: row[2],
      opening_balance: row[3], // stored in paisa
      current_balance: row[4]  // stored in paisa
    }));
  },

  createGroup: (name: string, parentId: string, nature: string) => {
    const db = getDb();
    let parentPath = '';

    if (parentId) {
        const parent = db.exec(`SELECT path FROM account_groups WHERE id = '${parentId}'`);
        if (parent.length) {
             parentPath = parent[0].values[0][0] as string;
        }
    }

    const id = uuidv4();
    const path = parentPath ? `${parentPath}/${name}` : `/${name}`;

    const stmt = db.prepare(`INSERT INTO account_groups (id, name, parent_group_id, nature, path) VALUES (?, ?, ?, ?, ?)`);
    stmt.run([id, name, parentId, nature, path]);
    stmt.free();

    saveDb();
    return id;
  },

  createLedger: (name: string, groupId: string, openingBalance: number) => {
    const db = getDb();
    const id = uuidv4();

    // Store opening balance in paisa
    const balanceInPaisa = Math.round(openingBalance * 100);

    const stmt = db.prepare(`INSERT INTO ledgers (id, name, group_id, opening_balance, current_balance) VALUES (?, ?, ?, ?, ?)`);
    stmt.run([id, name, groupId, balanceInPaisa, balanceInPaisa]);
    stmt.free();

    saveDb();
    return id;
  }
};
