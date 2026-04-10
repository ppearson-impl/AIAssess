import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, orgName, path, quickAnswers, scores, dimension } = body;

    if (!email || !orgName) {
      return NextResponse.json({ error: 'Email and organisation name are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('assessments')
      .insert([
        {
          email: email.toLowerCase().trim(),
          org_name: orgName,
          path: path, // 'quick' or 'detailed'
          quick_answers: path === 'quick' ? quickAnswers : null,
          dimension_scores: path === 'detailed' ? scores : null,
          completed_dimension: dimension,
          created_at: new Date().toISOString(),
        }
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data[0], success: true }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to save assessment' }, { status: 500 });
  }
}
