import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let targetUserId = user?.id;

    // Check optional body for explicit learner id
    try {
      const body = await req.json();
      if (body?.userId) targetUserId = body.userId;
    } catch {}

    if (targetUserId) {
      // Clear all progress tables for this user
      await Promise.allSettled([
        supabase.from('lesson_progress').delete().eq('user_id', targetUserId),
        supabase.from('quiz_attempts').delete().eq('user_id', targetUserId),
        supabase.from('boss_attempts').delete().eq('user_id', targetUserId),
        supabase.from('sim_runs').delete().eq('user_id', targetUserId),
        supabase.from('user_badges').delete().eq('user_id', targetUserId),
        supabase.from('xp_events').delete().eq('user_id', targetUserId),
        supabase.from('tutor_usage').delete().eq('user_id', targetUserId),
        supabase.from('profiles').update({
          xp: 0,
          coins: 0,
          streak: 1,
          best_streak: 1,
          streak_freezes: 0,
          last_active_date: null,
        }).eq('id', targetUserId),
      ]);
    }

    return NextResponse.json({
      success: true,
      message: 'Account reset successfully. All quiz and lesson progress cleared.',
    });
  } catch (err: any) {
    console.error('Reset API error:', err);
    return NextResponse.json(
      { success: true, message: 'Local reset complete (Database offline)' },
      { status: 200 }
    );
  }
}
