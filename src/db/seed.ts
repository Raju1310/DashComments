import { Database } from 'sql.js';

export const seedDatabase = (db: Database) => {
  // Check if we need to seed
  const result = db.exec("SELECT count(*) as count FROM account_groups");
  if (result[0].values[0][0] > 0) return;

  db.run("BEGIN TRANSACTION");

  // Root Groups
  const roots = [
    { id: 'g_assets', name: 'Assets', nature: 'Asset' },
    { id: 'g_liabilities', name: 'Liabilities', nature: 'Liability' },
    { id: 'g_income', name: 'Income', nature: 'Income' },
    { id: 'g_expenses', name: 'Expenses', nature: 'Expense' }
  ];

  roots.forEach(g => {
    console.log("Seeding root:", g);
    const stmt = db.prepare(`INSERT INTO account_groups (id, name, nature, path) VALUES (?, ?, ?, ?)`);
    stmt.run([g.id, g.name, g.nature, `/${g.name}`]);
    stmt.free();
  });

  // Sub Groups
  const subGroups = [
    { id: 'g_curr_assets', name: 'Current Assets', parent: 'g_assets', nature: 'Asset' },
    { id: 'g_fixed_assets', name: 'Fixed Assets', parent: 'g_assets', nature: 'Asset' },
    { id: 'g_bank', name: 'Bank Accounts', parent: 'g_curr_assets', nature: 'Asset' },
    { id: 'g_cash', name: 'Cash-in-Hand', parent: 'g_curr_assets', nature: 'Asset' },
    { id: 'g_curr_liab', name: 'Current Liabilities', parent: 'g_liabilities', nature: 'Liability' },
    { id: 'g_loans', name: 'Loans (Liability)', parent: 'g_liabilities', nature: 'Liability' },
    { id: 'g_direct_inc', name: 'Direct Income', parent: 'g_income', nature: 'Income' },
    { id: 'g_indirect_inc', name: 'Indirect Income', parent: 'g_income', nature: 'Income' },
    { id: 'g_direct_exp', name: 'Direct Expenses', parent: 'g_expenses', nature: 'Expense' },
    { id: 'g_indirect_exp', name: 'Indirect Expenses', parent: 'g_expenses', nature: 'Expense' },
  ];

  subGroups.forEach(g => {
    const parentPath = db.exec(`SELECT path FROM account_groups WHERE id = '${g.parent}'`)[0].values[0][0];
    const stmt = db.prepare(`INSERT INTO account_groups (id, name, parent_group_id, nature, path) VALUES (?, ?, ?, ?, ?)`);
    stmt.run([g.id, g.name, g.parent, g.nature, `${parentPath}/${g.name}`]);
    stmt.free();
  });

  // Default Ledgers
  const ledgers = [
    { id: 'l_cash', name: 'Cash', group: 'g_cash' },
    { id: 'l_sbi', name: 'SBI Bank', group: 'g_bank' }
  ];

  ledgers.forEach(l => {
    const stmt = db.prepare(`INSERT INTO ledgers (id, name, group_id, opening_balance, current_balance) VALUES (?, ?, ?, 0, 0)`);
    stmt.run([l.id, l.name, l.group]);
    stmt.free();
  });

  db.run("COMMIT");
  console.log("Database seeded successfully");
};
