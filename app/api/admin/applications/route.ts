import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        a.id,
        a.income,
        a.loan_amount,
        a.loan_term_months,
        a.loan_purpose,
        a.status,
        a.created_at,
        json_build_object(
          'full_name', u.full_name,
          'email', u.email,
          'phone', u.phone,
          'state', u.state
        ) AS users
      FROM applications a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC;
    `);

    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Failed to fetch admin applications queue:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}