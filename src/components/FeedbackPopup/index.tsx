import React, { useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import styles from './styles.module.scss';
import { useFeedback } from '@/context/feedbackContext';
import useAuth from '@/context/authContext';
import { checkHasUserSubmittedFeedback } from '@/services/feedback';
import Icon from '@/components/Icon';

/**
 * TEMPORARY FOR TESTING:
 * Set to `true` so the pop-up appears every time the user logs in on the Dashboard,
 * even if they have already submitted the feedback form.
 * Set to `false` in production to permanently hide the pop-up once the user has submitted feedback.
 */
const SHOW_POPUP_EVEN_IF_SUBMITTED = true;

const FeedbackPopup: React.FC = () => {
  const { isOpen: isDrawerOpen, openFeedback, isPopupDismissed, dismissPopup } = useFeedback();
  const { userEmail, userInfo, userName, token, superUser } = useAuth();

  const [shouldShow, setShouldShow] = useState(false);
  const [isAnimatedVisible, setIsAnimatedVisible] = useState(false);

  const cleanValue = (val?: string | null) => (val ? val.replace(/"/g, '').trim() : '');
  const userLoginValue =
    cleanValue(userEmail) ||
    cleanValue(Cookie.get('userEmail')) ||
    cleanValue(userInfo?.userLogin) ||
    cleanValue(userName) ||
    '';

  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout;

    const evaluatePopupVisibility = async () => {
      if (!superUser || isPopupDismissed || isDrawerOpen) {
        setIsAnimatedVisible(false);
        return;
      }

      const justLoggedIn =
        typeof window !== 'undefined' &&
        sessionStorage.getItem('wapi_show_feedback_popup_after_login') === 'true';

      if (!justLoggedIn && !shouldShow) {
        return;
      }

      if (!SHOW_POPUP_EVEN_IF_SUBMITTED) {
        const alreadySubmitted = await checkHasUserSubmittedFeedback(userLoginValue);
        if (!isMounted) return;
        if (alreadySubmitted) {
          sessionStorage.removeItem('wapi_show_feedback_popup_after_login');
          setShouldShow(false);
          return;
        }
      }

      if (isMounted) {
        setShouldShow(true);
        timer = setTimeout(() => {
          if (isMounted) {
            setIsAnimatedVisible(true);
          }
        }, 120);
      }
    };

    evaluatePopupVisibility();

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [superUser, isPopupDismissed, isDrawerOpen, userLoginValue, token]);

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('wapi_show_feedback_popup_after_login');
    }
    setIsAnimatedVisible(false);
    setTimeout(() => {
      dismissPopup();
      setShouldShow(false);
    }, 350);
  };

  const handleOpenFeedbackForm = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('wapi_show_feedback_popup_after_login');
    }
    setIsAnimatedVisible(false);
    dismissPopup();
    setShouldShow(false);
    openFeedback();
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && shouldShow && !isPopupDismissed) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shouldShow, isPopupDismissed]);

  if (!superUser || !shouldShow || isPopupDismissed || isDrawerOpen) {
    return null;
  }

  return (
    <div
      className={`${styles['popup-backdrop']} ${
        isAnimatedVisible ? styles['popup-backdrop--visible'] : ''
      }`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-popup-title"
    >
      <div
        className={`${styles['popup-card']} ${
          isAnimatedVisible ? styles['popup-card--visible'] : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className={styles['close-btn']}
          onClick={handleClose}
          aria-label="Close pop-up"
          title="Close"
        >
          ✕
        </button>

        {/* Visual Aurora Stage */}
        <div className={styles['stage']}>
          <div className={styles['stage__grid']} />
          <div className={styles['stage__orb-blue']} />
          <div className={styles['stage__orb-purple']} />
          <div className={styles['stage__orb-gold']} />

          {/* Floating decorative cards */}
          <div className={styles['stage__composition']}>
            <div className={`${styles['float-chip']} ${styles['float-chip--left']}`}>
              {/*<span className={styles['float-chip__emoji']}>⚡</span>*/}
              <span className={`${styles['float-chip__emoji']} ${styles['float-chip__emoji--lightning']}`}>
                <Icon name="lightning-contour" />
              </span>
              <div>
                <div className={styles['float-chip__label']}>Super Fast</div>
                <div className={styles['float-chip__sub']}>Just 2 minutes</div>
              </div>
            </div>

            <div className={styles['center-emblem']}>
              <div className={styles['center-emblem__ring-1']} />
              <div className={styles['center-emblem__ring-2']} />
              <div className={styles['center-emblem__core']}>
                <Icon name="questionnaire" />
                <span className={styles['center-emblem__sparkle']}>
                  <Icon name="star" />
                </span>
              </div>
            </div>

            <div className={`${styles['float-chip']} ${styles['float-chip--right']}`}>
              {/*<span className={styles['float-chip__emoji']}>⏳</span>*/}
              <span className={`${styles['float-chip__emoji']} ${styles['float-chip__emoji--sand-clock']}`}>
                <Icon name="sand-clock" />
              </span>
              <div>
                <div className={styles['float-chip__label']}>1 Week Only</div>
                <div className={styles['float-chip__sub']}>Limited time</div>
              </div>
            </div>
          </div>

          <div className={styles['stage__text']}>
            <span className={styles['eyebrow-badge']}>
              <span className={styles['eyebrow-badge__pulse']} />
              WE VALUE YOUR VOICE
            </span>
            <h2 id="feedback-popup-title" className={styles['stage__title']}>
              Help Us Shape the Future of{' '}
              <span className={styles['stage__title-highlight']}>WAPI UI</span>
            </h2>
            <p className={styles['stage__subtitle']}>
              We are gathering feedback on our UI features to craft a faster, smarter workspace tailored around your daily workflow.
            </p>
          </div>
        </div>

        {/* Lower Content Section */}
        <div className={styles['content']}>
          <div className={styles['bento-grid']}>
            <div className={styles['bento-card']}>
              <div className={styles['bento-card__badge']}>
                {/* +temporary*/}
                <svg xmlns="http://www.w3.org/2000/svg"
                     width="10px" height="10px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" >
                  <path fill="#1e40af" d="M32,0C14.328,0,0,14.328,0,32s14.328,32,32,32s32-14.328,32-32S49.672,0,32,0z M42.844,42.844
                      c-1.566,1.566-4.168,1.488-5.734-0.078l-7.934-7.934c-0.371-0.367-0.664-0.812-0.867-1.305C28.105,33.039,28,32.523,28,32V16
                      c0-2.211,1.789-4,4-4s4,1.789,4,4v14.344l6.859,6.859C44.426,38.77,44.406,41.281,42.844,42.844z"/>
                </svg>
                {/* -temporary*/}
                <span>️ ~2 MINUTES</span>
              </div>
              <h3 className={styles['bento-card__title']}>Takes Only 2 Minutes</h3>
              <p className={styles['bento-card__text']}>
                Quick multiple-choice questions — share what slows you down and what you want to see improved first.
              </p>
            </div>

            <div className={`${styles['bento-card']} ${styles['bento-card--warm']}`}>
              <div className={styles['bento-card__badge']}>
                <svg width="12px" height="12px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill="darkorange" d="M5.926 20.574a7.26 7.26 0 0 0 3.039 1.511c.107.035.179-.105.107-.175-2.395-2.285-1.079-4.758-.107-5.873.693-.796 1.68-2.107 1.608-3.865 0-.176.18-.317.322-.211 1.359.703 2.288 2.25 2.538 3.515.394-.386.537-.984.537-1.511 0-.176.214-.317.393-.176 1.287 1.16 3.503 5.097-.072 8.19-.071.071 0 .212.072.177a8.761 8.761 0 0 0 3.003-1.442c5.827-4.5 2.037-12.48-.43-15.116-.321-.317-.893-.106-.893.351-.036.95-.322 2.004-1.072 2.707-.572-2.39-2.478-5.105-5.195-6.441-.357-.176-.786.105-.75.492.07 3.27-2.063 5.352-3.922 8.059-1.645 2.425-2.717 6.89.822 9.808z"/></svg>
                <span> OPEN FOR 7 DAYS</span>
              </div>
              <h3 className={styles['bento-card__title']}>Available 1 Week Only</h3>
              <p className={styles['bento-card__text']}>
                This special survey is live for just one week. We would truly appreciate your input while it is open!
              </p>
            </div>
          </div>

          {/* Widget Always Available Showcase */}
          <div className={styles['widget-showcase']}>
            <div className={styles['widget-showcase__info']}>
              <div className={styles['widget-showcase__heading']}>
                <span className={styles['widget-showcase__dot']} />
                Always Here Whenever Inspiration Strikes
              </div>
              <p className={styles['widget-showcase__desc']}>
                Even after you submit your feedback, the{' '}
                <strong>&ldquo;Feedback &amp; Wishes&rdquo;</strong> button stays available in your screen corner and profile menu in case you ever want to add more ideas!
              </p>
            </div>

            <div
              className={styles['widget-showcase__pill']}
              onClick={handleOpenFeedbackForm}
              title="Click to open feedback form"
            >
              <span className={styles['widget-showcase__pill-icon']}>
                <Icon name="questionnaire" />
              </span>
              <span className={styles['widget-showcase__pill-text']}>
                Feedback &amp; Wishes
              </span>
            </div>
          </div>

          {/* CTA Footer */}
          <div className={styles['footer']}>
            <button
              type="button"
              className={styles['dismiss-btn']}
              onClick={handleClose}
            >
              Maybe later
            </button>

            <button
              type="button"
              className={styles['cta-btn']}
              onClick={handleOpenFeedbackForm}
            >
              <span className={styles['cta-btn__shimmer']} />
              <span className={styles['cta-btn__text']}>
                Share My Feedback Now
              </span>
              <span className={styles['cta-btn__arrow']}>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPopup;
