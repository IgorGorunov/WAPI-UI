import React, { useState } from 'react';
import styles from './styles.module.scss';
import { useFeedback } from '@/context/feedbackContext';
import useAuth from '@/context/authContext';
import { UserStatusType } from '@/types/leads';
import Icon from "@/components/Icon";

const FeedbackWidget: React.FC = () => {
  const { openFeedback } = useFeedback();
  const { userStatus, superUser } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);

  // Temporary: Only display for logged-in superusers
  if (userStatus !== UserStatusType.user || !superUser || isDismissed) {
    return null;
  }

  return (
    <div className={styles['floating-widget']}>
      <button
        type="button"
        className={styles['pill-button']}
        onClick={openFeedback}
        title="Share your thoughts & UI wishes"
      >
        {/*<span className={styles['pill-button__badge']} />*/}
        <span className={styles['pill-button__icon']}><Icon name="questionnaire" /></span>
        <span className={styles['pill-button__text']}>Feedback & Wishes</span>
      </button>

      <button
        type="button"
        className={styles['minimize-button']}
        onClick={() => setIsDismissed(true)}
        title="Dismiss feedback button for this session"
        aria-label="Dismiss feedback button"
      >
        ✕
      </button>
    </div>
  );
};

export default FeedbackWidget;
