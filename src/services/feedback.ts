export interface FeedbackResponses {
  frequent_sections?: string[];
  frequent_sections_other?: string;
  workflow_slowdowns?: string[];
  missing_features_details?: string;
  workflow_slowdowns_other?: string;
  dashboard_info?: string[];
  dashboard_info_other?: string;
  priority_improvements?: string[];
  priority_improvements_other?: string;
  ui_satisfaction?: number;
  usage_frequency?: string;
  additional_comments?: string;
  [key: string]: any;
}

export interface FeedbackUserMetadata {
  userLogin?: string;
  userName?: string;
  client?: string;
  token?: string;
  userUuid?: string | null;
}

export interface SubmitFeedbackResult {
  success: boolean;
  error?: string;
}

const FEEDBACK_SUBMITTED_STORAGE_KEY = 'wapi_ui_feedback_submitted_v1';

export const markFeedbackSubmittedLocally = (userLogin?: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FEEDBACK_SUBMITTED_STORAGE_KEY, 'true');
    if (userLogin) {
      localStorage.setItem(`${FEEDBACK_SUBMITTED_STORAGE_KEY}_${userLogin}`, 'true');
    }
  } catch (e) {
    // Ignore storage errors
  }
};

export const checkHasUserSubmittedFeedback = async (userLogin?: string): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  try {
    if (userLogin && localStorage.getItem(`${FEEDBACK_SUBMITTED_STORAGE_KEY}_${userLogin}`) === 'true') {
      return true;
    }
    if (localStorage.getItem(FEEDBACK_SUBMITTED_STORAGE_KEY) === 'true') {
      return true;
    }
  } catch (e) {
    // Ignore localStorage read errors
  }

  if (!userLogin || userLogin === 'anonymous') {
    return false;
  }

  try {
    const res = await fetch(`/api/feedback?userLogin=${encodeURIComponent(userLogin)}`, {
      method: 'GET',
    });

    if (!res.ok) return false;

    const data = await res.json();
    if (data?.submitted) {
      markFeedbackSubmittedLocally(userLogin);
      return true;
    }
  } catch (e) {
    // Ignore query errors
  }

  return false;
};

export const submitFeedback = async (
  responses: FeedbackResponses,
  userMetadata?: FeedbackUserMetadata
): Promise<SubmitFeedbackResult> => {
  const userLogin = userMetadata?.userLogin || 'anonymous';

  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        responses,
        userMetadata,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
      return {
        success: false,
        error: data?.error || 'Failed to submit feedback. Please try again.',
      };
    }

    markFeedbackSubmittedLocally(userLogin);
    return { success: true };
  } catch (err: any) {
    console.error('Unexpected error submitting feedback:', err);
    return {
      success: false,
      error: err?.message || 'Unexpected network error occurred',
    };
  }
};
