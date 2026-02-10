import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from "react";

export default function Db() {
    const db = useSQLiteContext();
    // useEffect(() => {
    //   const seedDb = async () => {
    //     await db.execAsync(`
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
    //     foreign key(category_id) references categories(id)
        
    //   );

    //   DELETE FROM transactions;
    //   DELETE FROM categories;

    //   PRAGMA FOREIGN_KEYS = ON;
    //   PRAGMA journal_mode = WAL;

    //   INSERT INTO categories (name) VALUES ('Shopping');
    //   INSERT INTO categories (name) VALUES ('Groceries');

    //   INSERT INTO transactions (type, value, description, category_id, created_at) VALUES
    //   ('income', 1200.00, 'January salary', 2, '2026-01-02 09:00:00'),
    //   ('expense', 85.40, 'Supermarket run', 2, '2026-01-03 18:20:00'),
    //   ('expense', 42.99, 'Online shopping', 1, '2026-01-05 21:10:00'),
    //   ('expense', 15.20, 'Groceries', 2, '2026-01-08 12:30:00'),
    //   ('income', 150.00, 'Freelance task', 2, '2026-01-10 14:15:00'),
    //   ('expense', 220.75, 'Clothes', 1, '2026-01-12 17:45:00'),
    //   ('expense', 64.10, 'Weekly groceries', 2, '2026-01-15 13:05:00'),
    //   ('expense', 33.50, 'Household items', 1, '2026-01-18 19:40:00'),
    //   ('income', 90.00, 'Sold old item', 1, '2026-01-21 11:25:00'),
    //   ('expense', 72.30, 'Groceries', 2, '2026-01-24 16:55:00'),
    //   ('expense', 140.00, 'Shoes', 1, '2026-01-27 20:10:00'),
    //   ('expense', 58.90, 'End of month groceries', 2, '2026-01-30 18:35:00');


      
    //   INSERT INTO transactions (type, value, description, category_id) VALUES ('income', 235.66, 'desc1', 2);
    //   INSERT INTO transactions (type, value, description, category_id) VALUES ('expense', 422.66, 'desc2', 1);
    //   INSERT INTO transactions (type, value, description, category_id) VALUES ('income', 25.66, 'desc3', 2);
    //   INSERT INTO transactions (type, value, description, category_id) VALUES ('expense', 2400.66, 'desc4', 2);
    //   INSERT INTO transactions (type, value, description, category_id) VALUES ('expense', 125.66, 'desc5', 1);

    //   INSERT INTO transactions (type, value, description, category_id, created_at) VALUES
    //   ('income', 1250.00, 'March salary', 2, '2026-03-01 09:10:00'),
    //   ('expense', 78.60, 'Groceries', 2, '2026-03-02 18:25:00'),
    //   ('expense', 49.99, 'Online order', 1, '2026-03-04 21:15:00'),
    //   ('expense', 22.30, 'Market', 2, '2026-03-06 12:40:00'),
    //   ('income', 200.00, 'Side project', 2, '2026-03-08 15:00:00'),
    //   ('expense', 180.45, 'Jacket', 1, '2026-03-10 17:20:00'),
    //   ('expense', 69.80, 'Weekly groceries', 2, '2026-03-13 13:50:00'),
    //   ('expense', 35.00, 'Home supplies', 1, '2026-03-16 19:30:00'),
    //   ('income', 60.00, 'Refund', 1, '2026-03-19 10:45:00'),
    //   ('expense', 74.25, 'Groceries', 2, '2026-03-22 17:10:00'),
    //   ('expense', 120.00, 'Electronics accessory', 1, '2026-03-25 20:05:00'),
    //   ('expense', 55.60, 'End of month groceries', 2, '2026-03-29 18:55:00');

    //   `);
    // }
    // seedDb();
    // })
    return null;
}