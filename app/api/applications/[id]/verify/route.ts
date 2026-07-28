import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Safely resolve params for Next.js App Router compatibility
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    const { externalVerifyLink } = await request.json();

    if (!externalVerifyLink) {
      return NextResponse.json({ error: 'Target destination link missing' }, { status: 400 });
    }

    const normalizedId = id.toUpperCase();

    // Mutate and append the external verification parameters to row values
    await query(
      `UPDATE applications 
       SET external_verify_link = $1, status = 'reviewing'
       WHERE id = $2`,
      [externalVerifyLink, normalizedId]
    );

    // Inject system tracking log sequence
    await query(
      `INSERT INTO underwriter_logs (application_id, event_type, log_message)
       VALUES ($1, 'STATUS_MUTATION', 'Underwriter appended verification routing protocol payload link.')`,
      [normalizedId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Operation mutation exception' }, { status: 500 });
  }
}