export const TABLES = [
  `CREATE TABLE IF NOT EXISTS account_groups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    parent_group_id TEXT,
    nature TEXT, -- 'Asset', 'Liability', 'Income', 'Expense'
    path TEXT, -- Materialized path e.g. /Root/Parent/Child
    FOREIGN KEY(parent_group_id) REFERENCES account_groups(id)
  );`,
  `CREATE TABLE IF NOT EXISTS ledgers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    group_id TEXT NOT NULL,
    opening_balance INTEGER DEFAULT 0, -- stored in paisa
    current_balance INTEGER DEFAULT 0, -- stored in paisa
    FOREIGN KEY(group_id) REFERENCES account_groups(id)
  );`,
  `CREATE TABLE IF NOT EXISTS vouchers (
    id TEXT PRIMARY KEY,
    voucher_number TEXT NOT NULL,
    voucher_type TEXT NOT NULL, -- 'Payment', 'Receipt', etc.
    date TEXT NOT NULL, -- ISO date string
    narration TEXT,
    is_cancelled BOOLEAN DEFAULT 0,
    created_at INTEGER,
    updated_at INTEGER
  );`,
  `CREATE TABLE IF NOT EXISTS voucher_entries (
    id TEXT PRIMARY KEY,
    voucher_id TEXT NOT NULL,
    ledger_id TEXT NOT NULL,
    amount INTEGER NOT NULL, -- in paisa.
    type TEXT NOT NULL, -- 'Dr' or 'Cr'
    FOREIGN KEY(voucher_id) REFERENCES vouchers(id),
    FOREIGN KEY(ledger_id) REFERENCES ledgers(id)
  );`,
  `CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL,
    changes_json TEXT,
    timestamp INTEGER
  );`
];
