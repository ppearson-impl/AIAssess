import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Prevent static generation of dynamic API routes
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orgName = searchParams.get('orgName');

    let query = supabase
      .from('assessments')
      .select('id, org_name, path, created_at, quick_answers, dimension_scores')
      .order('created_at', { ascending: false })
      .limit(50);

    if (orgName) {
      query = query.ilike('org_name', `%${orgName}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
  }
}
