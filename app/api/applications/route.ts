import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET: Look up an application by ID with user join
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing application token identifier' },
      { status: 400 }
    );
  }

  const normalizedId = id.trim().toUpperCase();

  try {
    const result = await query(
      `SELECT 
        a.id, 
        u.full_name AS "fullName", 
        a.status, 
        a.loan_amount AS "loanAmount", 
        a.loan_purpose AS "loanPurpose", 
        a.external_verify_link AS "externalVerifyLink", 
        a.created_at AS "createdAt"
       FROM applications a
       JOIN users u ON a.user_id = u.id
       WHERE a.id = $1`,
      [normalizedId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Token reference match not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database application lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve application' },
      { status: 500 }
    );
  }
}

// POST: Save user & multi-step application payload into PostgreSQL database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      dob,
      email,
      phone,
      streetAddress,
      city,
      state,
      zipCode,
      employmentStatus,
      employerName,
      annualIncome,
      loanPurpose,
      ssnLast4,
      dlState,
      driverLicenseNumber,
      loanAmount,
      loanTerm,
    } = body;

    const generatedNumber = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `LN-2026-${generatedNumber}`;
    const externalVerifyLink = `https://verify.loanexa.com/session/${generatedId}`;

    // 1. Insert or update user first to satisfy applications.user_id foreign key constraint
    const userQuery = `
      INSERT INTO users (full_name, email, phone, dob, address, city, state, zip)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (email) DO UPDATE 
      SET full_name = EXCLUDED.full_name,
          phone = EXCLUDED.phone,
          address = EXCLUDED.address,
          city = EXCLUDED.city,
          state = EXCLUDED.state,
          zip = EXCLUDED.zip
      RETURNING id;
    `;

    const userValues = [
      fullName || 'Applicant',
      email || `applicant_${Date.now()}@loanexa.local`,
      phone || '000-000-0000',
      dob || '2000-01-01',
      streetAddress || 'Not Provided',
      city || 'Not Provided',
      state || 'CA',
      zipCode || '00000',
    ];

    const userResult = await query(userQuery, userValues);
    const userId = userResult.rows[0].id;

    // 2. Insert into applications using your exact database schema column names
    const insertQuery = `
      INSERT INTO applications (
        id,
        user_id,
        income,
        employment_status,
        employer_name,
        loan_amount,
        loan_term_months,
        loan_purpose,
        ssn_last_4,
        license_number,
        license_state,
        external_verify_link,
        status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending'
      )
      RETURNING id;
    `;

    const termMonths = parseInt(loanTerm, 10) || 12;

    const values = [
      generatedId,
      userId,
      annualIncome ? parseFloat(annualIncome) : 0,
      employmentStatus || 'Full-Time',
      employerName || null,
      loanAmount ? parseFloat(loanAmount) : 5000,
      termMonths,
      loanPurpose || 'Debt Consolidation',
      ssnLast4 || '0000',
      driverLicenseNumber || 'NONE',
      dlState || state || 'CA',
      externalVerifyLink,
    ];

    const result = await query(insertQuery, values);

    return NextResponse.json({ id: result.rows[0].id, success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Database insert error:', error);
    return NextResponse.json(
      { error: 'Failed to record application in database', details: error.message },
      { status: 500 }
    );
  }
}