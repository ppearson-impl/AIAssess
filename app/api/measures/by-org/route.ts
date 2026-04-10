import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const org_name = searchParams.get('org_name');

    if (!org_name) {
      return NextResponse.json(
        { error: 'Missing required query parameter: org_name' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('custom_measures')
      .select('*')
      .eq('org_name', org_name.toLowerCase().trim())
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found (expected)
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to retrieve custom measures', details: error.message },
        { status: 500 }
      );
    }

    // If no custom measures found, return null (frontend will use defaults)
    if (error?.code === 'PGRST116' || !data) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
