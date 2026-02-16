import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from "react";

export default function Db() {
    const db = useSQLiteContext();
    // useEffect(() => {
    //   const seedDb = async () => {
    //     await db.execAsync(`
        
    //     DROP TABLE IF EXISTS transactions;
    //     DROP TABLE IF EXISTS categories;

    //     CREATE TABLE IF NOT EXISTS categories (
    //     id INTEGER PRIMARY KEY,
    //     name TEXT NOT NULL,
    //     created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    //     );

    //     CREATE TABLE IF NOT EXISTS transactions (
    //     id INTEGER PRIMARY KEY,
    //     type TEXT NOT NULL,
    //     value REAL NOT NULL,
    //     description TEXT,
    //     category_id INTEGER,
    //     created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    //     foreign key(category_id) references categories(id) on delete cascade on update cascade
        
    //   );

    //   PRAGMA FOREIGN_KEYS = ON;
    //   PRAGMA journal_mode = WAL;

    //   `);
    // }
    // seedDb();
    // })
    return null;
}