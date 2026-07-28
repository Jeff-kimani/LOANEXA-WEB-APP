// import { Pool } from 'pg';

// const pool = new Pool({
//   user: process.env.PGUSER,
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   password: process.env.PGPASSWORD,
//   port: Number(process.env.PGPORT || 5432),
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
// });

// export async function query(text: string, params?: any[]) {
//   const start = Date.now();
//   try {
//     const res = await pool.query(text, params);
//     const duration = Date.now() - start;
//     console.log('Executed query', { text, duration, rows: res.rowCount });
//     return res;
//   } catch (error) {
//     console.error('Database query error layer:', error);
//     throw error;
//   }
// }




import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  // Fallback to individual variables if connectionString isn't defined
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT || 5432),
  // Supabase ALWAYS requires SSL, even in local development
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error layer:', error);
    throw error;
  }
}