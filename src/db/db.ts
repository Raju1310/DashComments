import initSqlJs, { Database } from 'sql.js';
import * as idb from 'idb-keyval';
import { TABLES } from './schema';
import { seedDatabase } from './seed';

let db: Database | null = null;
const DB_KEY = 'openledger_db';

export const getDb = (): Database => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

export const initDb = async (): Promise<void> => {
  if (db) return;

  try {
      const SQL = await initSqlJs({
    locateFile: (file) => {
        console.log("SQL.js requesting:", file);
        return `/assets/${file}`;
    },
      });

      const savedData = await idb.get(DB_KEY);

      if (savedData) {
        db = new SQL.Database(new Uint8Array(savedData));
        console.log('Loaded database from IndexedDB');
      } else {
        db = new SQL.Database();
        console.log('Created new in-memory database');

        // Create Tables
        db.run('BEGIN TRANSACTION');
        TABLES.forEach((query) => db!.run(query));
        db.run('COMMIT');

        // Seed Data
        seedDatabase(db);

        saveDb();
      }
  } catch (e) {
      console.error("Failed to initialize database", e);
      throw e;
  }
};

export const saveDb = async (): Promise<void> => {
  if (!db) return;
  const data = db.export();
  await idb.set(DB_KEY, data);
  console.log('Saved database to IndexedDB');
};
