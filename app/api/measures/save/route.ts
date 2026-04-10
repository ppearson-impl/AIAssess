import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Prevent static generation of dynamic API routes
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { org_name, dims_config, created_by } = body;

    if (!org_name || !dims_config) {
      return NextResponse.json(
        { error: 'Missing required fields: org_name and dims_config' },
        { status: 400 }
      );
    }

    // Upsert custom measures (insert if not exists, update if exists)
    const { data, error } = await supabase
      .from('custom_measures')
      .upsert(
        {
          org_name: org_name.toLowerCase().trim(),
          dims_config,
          created_by: created_by || 'anonymous',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'org_name' }
      )
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save custom measures', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
