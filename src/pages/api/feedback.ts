import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return res.status(500).json({
      success: false,
      error: 'Supabase client is not configured. Please check environment variables.',
    });
  }

  const primaryTable =
    process.env.NEXT_PUBLIC_SUPABASE_FEEDBACK_TABLE ||
    process.env.SUPABASE_FEEDBACK_TABLE ||
    'user_feedback';

  // GET /api/feedback?userLogin=... -> check if user already submitted feedback
  if (req.method === 'GET') {
    const userLogin = typeof req.query.userLogin === 'string' ? req.query.userLogin.trim() : '';

    if (!userLogin || userLogin === 'anonymous') {
      return res.status(200).json({ submitted: false });
    }

    try {
      const { data, error } = await supabase
        .from(primaryTable)
        .select('user_login')
        .eq('user_login', userLogin)
        .eq('survey_code', 'ui_feedback_v1')
        .limit(1);

      if (!error && data && data.length > 0) {
        return res.status(200).json({ submitted: true });
      }

      return res.status(200).json({ submitted: false });
    } catch (err) {
      return res.status(200).json({ submitted: false });
    }
  }

  // POST /api/feedback -> submit feedback payload
  if (req.method === 'POST') {
    const { responses, userMetadata } = req.body || {};

    if (!responses || typeof responses !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid feedback payload.',
      });
    }

    const payload = {
      user_login: userMetadata?.userLogin || 'anonymous',
      user_name: userMetadata?.userName || null,
      client: userMetadata?.client || null,
      token: userMetadata?.token || null,
      user_uuid: userMetadata?.userUuid || null,
      survey_code: 'ui_feedback_v1',
      responses,
    };

    try {
      const { error } = await supabase.from(primaryTable).insert([payload]);

      if (error) {
        // Fallback 1: if table name was created as ui_feedback instead of user_feedback
        if (
          primaryTable === 'user_feedback' &&
          (error.message?.includes('relation') || error.code === '42P01')
        ) {
          const fallbackRes = await supabase.from('ui_feedback').insert([payload]);
          if (!fallbackRes.error) {
            return res.status(200).json({ success: true });
          }
        }

        // Fallback 2: if a unique constraint exists on (user_login, survey_code) in DB,
        // update the existing record so the submission never fails
        if (error.code === '23505') {
          const updateRes = await supabase
            .from(primaryTable)
            .update(payload)
            .eq('user_login', payload.user_login)
            .eq('survey_code', payload.survey_code);

          if (!updateRes.error) {
            return res.status(200).json({ success: true });
          }
        }

        console.error('Error submitting feedback to Supabase:', error);
        return res.status(500).json({ success: false, error: error.message });
      }

      return res.status(200).json({ success: true });
    } catch (err: any) {
      console.error('Unexpected error submitting feedback:', err);
      return res.status(500).json({
        success: false,
        error: err?.message || 'Unexpected server error occurred',
      });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
