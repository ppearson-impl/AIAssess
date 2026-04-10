import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('assessments')
      .select('id, email, org_name, path, created_at')
      .eq('email', email.toLowerCase().trim())
      .order('created_at', { ascending: false });

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
