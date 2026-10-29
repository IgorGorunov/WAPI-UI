import React, { useState, useEffect, useRef } from 'react';
import Cookie from 'js-cookie';
import styles from './styles.module.scss';
import { useFeedback } from '@/context/feedbackContext';
import useAuth from '@/context/authContext';
import useTenant from '@/context/tenantContext';
import { submitFeedback, FeedbackResponses } from '@/services/feedback';
import Icon from "@/components/Icon";
import Checkbox from "@/components/FormBuilder/Checkbox";
import TextField from "@/components/FormBuilder/TextInput/TextField";
import TextArea from "@/components/FormBuilder/TextArea";
import { OptionType } from "@/types/forms";

const FREQUENT_SECTIONS_OPTIONS = [
  'Orders',
  'Products',
  'Stock Movements',
  'Reports',
];

const SLOWDOWNS_OPTIONS = [
  'Hard to find required information',
  'Too many columns and fields',
  'Complex navigation',
  'Slow loading times or system errors',
  'Missing features',
];

const DASHBOARD_NONE_OPTION = "I don't need any additional information";

const DASHBOARD_INFO_OPTIONS = [
  {
    title: 'Delivery Issues & Problem Orders',
    desc: 'Orders with delivery problems (e.g., incorrect address/phone, recipient unavailable, courier delay) so you can contact the client before the parcel is returned',
  },
  {
    title: 'Delivery Success & Return Rates',
    desc: 'Overall percentage of delivered vs. returned orders, including which couriers and countries perform best',
  },
  {
    title: 'Low Stock & Out-of-Stock Warnings',
    desc: 'Alerts when products are running low or out of stock in warehouses, so you know what can and cannot be sold',
  },
  {
    title: 'Order Fulfillment & Courier Statuses',
    desc: 'A live view of order stages (waiting for dispatch, in transit, out for delivery today, delayed)',
  },
];

const IMPROVEMENTS_OPTIONS = [
  'Compact tables and forms',
  'Customizable columns',
  // 'Global search across the platform',
  'Quick actions and keyboard shortcuts',
  'Dark theme',
];

const SATISFACTION_LABELS: Record<number, string> = {
  1: 'Very poor',
  2: 'Poor',
  3: 'Neutral',
  4: 'Good',
  5: 'Excellent',
};

const FREQUENCY_OPTIONS: OptionType[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'A few times a week' },
  { value: 'monthly', label: 'A few times a month' },
  { value: 'rarely', label: 'Rarely / Almost never' },
];

const FeedbackDrawer: React.FC = () => {
  const { isOpen, closeFeedback } = useFeedback();
  const { userName, userInfo, token, superUser, ui, superUserName, userEmail } = useAuth();
  const { tenantData } = useTenant();

  // Fresh question state
  const [frequentSections, setFrequentSections] = useState<string[]>([]);
  const [hasOtherSection, setHasOtherSection] = useState(false);
  const [frequentSectionsOther, setFrequentSectionsOther] = useState('');

  const [workflowSlowdowns, setWorkflowSlowdowns] = useState<string[]>([]);
  const [missingFeaturesText, setMissingFeaturesText] = useState('');
  const [hasOtherSlowdowns, setHasOtherSlowdowns] = useState(false);
  const [workflowSlowdownsOther, setWorkflowSlowdownsOther] = useState('');

  const [dashboardInfo, setDashboardInfo] = useState<string[]>([]);
  const [hasOtherDashboardInfo, setHasOtherDashboardInfo] = useState(false);
  const [dashboardInfoOther, setDashboardInfoOther] = useState('');

  const [priorityImprovements, setPriorityImprovements] = useState<string[]>([]);
  const [hasOtherImprovement, setHasOtherImprovement] = useState(false);
  const [priorityImprovementsOther, setPriorityImprovementsOther] = useState('');

  const [uiSatisfaction, setUiSatisfaction] = useState<number | null>(null);
  const [usageFrequency, setUsageFrequency] = useState<string>('');
  const [additionalComments, setAdditionalComments] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnimatedOpen, setIsAnimatedOpen] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const q1Ref = useRef<HTMLDivElement>(null);
  const q2Ref = useRef<HTMLDivElement>(null);
  const q3Ref = useRef<HTMLDivElement>(null);
  const q4Ref = useRef<HTMLDivElement>(null);
  const q5Ref = useRef<HTMLDivElement>(null);
  const q6Ref = useRef<HTMLDivElement>(null);
  const q7Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    if (isOpen) {
      rafId = requestAnimationFrame(() => {
        setIsAnimatedOpen(true);
      });
    } else {
      setIsAnimatedOpen(false);
    }
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeFeedback();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeFeedback]);

  useEffect(() => {
    console.log('1212', userInfo)
  }, [userInfo]);

  // Reset form cleanly whenever opened
  useEffect(() => {
    if (isOpen) {
      setFrequentSections([]);
      setHasOtherSection(false);
      setFrequentSectionsOther('');
      setHasOtherSlowdowns(false);
      setWorkflowSlowdowns([]);
      setMissingFeaturesText('');
      setWorkflowSlowdownsOther('');
      setDashboardInfo([]);
      setHasOtherDashboardInfo(false);
      setDashboardInfoOther('');
      setPriorityImprovements([]);
      setHasOtherImprovement(false);
      setPriorityImprovementsOther('');
      setUiSatisfaction(null);
      setUsageFrequency('');
      setAdditionalComments('');
      setIsSubmitting(false);
      setSubmitError(null);
      setIsSubmitted(false);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const toggleArrayItem = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((x) => x !== item));
    } else {
      setter([...list, item]);
    }
  };

  const isQ1Valid =
    (frequentSections.length > 0 || hasOtherSection) &&
    (!hasOtherSection || frequentSectionsOther.trim().length >= 1);

  const hasMissingFeatures = workflowSlowdowns.includes('Missing features');

  const isQ2Valid =
    (workflowSlowdowns.length > 0 || hasOtherSlowdowns) &&
    (!hasMissingFeatures || missingFeaturesText.trim().length >= 1) &&
    (!hasOtherSlowdowns || workflowSlowdownsOther.trim().length >= 1);

  const isQ3Valid =
    (dashboardInfo.length > 0 || hasOtherDashboardInfo) &&
    (!hasOtherDashboardInfo || dashboardInfoOther.trim().length >= 1);

  const isQ4Valid =
    (priorityImprovements.length > 0 || hasOtherImprovement) &&
    (!hasOtherImprovement || priorityImprovementsOther.trim().length >= 1);

  const isQ5Valid = uiSatisfaction !== null;

  const isQ6Valid = !!usageFrequency;

  const isQ7Valid = additionalComments.trim().length >= 1;

  const isFormValid =
    isQ1Valid &&
    isQ2Valid &&
    isQ3Valid &&
    isQ4Valid &&
    isQ5Valid &&
    isQ6Valid;

  const answeredCount = [
    isQ1Valid,
    isQ2Valid,
    isQ3Valid,
    isQ4Valid,
    isQ5Valid,
    isQ6Valid,
    isQ7Valid,
  ].filter(Boolean).length;
  const totalQuestions = 7;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const hasAnyAnswer =
    frequentSections.length > 0 ||
    hasOtherSection ||
    workflowSlowdowns.length > 0 ||
    hasOtherSlowdowns ||
    dashboardInfo.length > 0 ||
    hasOtherDashboardInfo ||
    priorityImprovements.length > 0 ||
    hasOtherImprovement ||
    uiSatisfaction !== null ||
    !!usageFrequency ||
    additionalComments.trim().length > 0;

  // Clear validation error banner as soon as all required questions are answered
  useEffect(() => {
    if (isFormValid && submitError === 'Please complete all highlighted questions before submitting.') {
      setSubmitError(null);
    }
  }, [isFormValid, submitError]);

  const q1Error = hasAttemptedSubmit && !isQ1Valid
    ? (hasOtherSection && !frequentSectionsOther.trim()
        ? 'Please specify your answer for "Other sections".'
        : 'Please select at least one section.')
    : '';

  const q2Error = hasAttemptedSubmit && !isQ2Valid
    ? (hasMissingFeatures && !missingFeaturesText.trim()
        ? 'Please specify which features are missing.'
        : hasOtherSlowdowns && !workflowSlowdownsOther.trim()
          ? 'Please specify your answer for "Other issues".'
          : 'Please select at least one option.')
    : '';

  const q3Error = hasAttemptedSubmit && !isQ3Valid
    ? (hasOtherDashboardInfo && !dashboardInfoOther.trim()
        ? 'Please specify your answer for "Other".'
        : 'Please select at least one option.')
    : '';

  const q4Error = hasAttemptedSubmit && !isQ4Valid
    ? (hasOtherImprovement && !priorityImprovementsOther.trim()
        ? 'Please specify your answer for "Other".'
        : 'Please select at least one option.')
    : '';

  const q5Error = hasAttemptedSubmit && !isQ5Valid
    ? 'Please rate the interface from 1 to 5.'
    : '';

  const q6Error = hasAttemptedSubmit && !isQ6Valid
    ? 'Please select how often you use WAPI UI.'
    : '';

  // const q7Error = hasAttemptedSubmit && !isQ7Valid
  //   ? 'Please provide your feedback or suggestions.'
  //   : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (!isFormValid) {
      const firstInvalidRef =
        (!isQ1Valid && q1Ref) ||
        (!isQ2Valid && q2Ref) ||
        (!isQ3Valid && q3Ref) ||
        (!isQ4Valid && q4Ref) ||
        (!isQ5Valid && q5Ref) ||
        (!isQ6Valid && q6Ref);

      if (firstInvalidRef && firstInvalidRef.current) {
        firstInvalidRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }

      setSubmitError('Please complete all highlighted questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const responses: FeedbackResponses = {
      frequent_sections: frequentSections,
      ...(hasOtherSection && frequentSectionsOther.trim()
        ? { frequent_sections_other: frequentSectionsOther.trim() }
        : {}),
      workflow_slowdowns: workflowSlowdowns,
      ...(hasMissingFeatures && missingFeaturesText.trim()
        ? { missing_features_details: missingFeaturesText.trim() }
        : {}),
      ...(hasOtherSlowdowns && workflowSlowdownsOther.trim()
          ? { workflow_slowdowns_other: workflowSlowdownsOther.trim() }
          : {}),
      dashboard_info: dashboardInfo,
      ...(hasOtherDashboardInfo && dashboardInfoOther.trim()
        ? { dashboard_info_other: dashboardInfoOther.trim() }
        : {}),
      priority_improvements: priorityImprovements,
      ...(hasOtherImprovement && priorityImprovementsOther.trim()
        ? { priority_improvements_other: priorityImprovementsOther.trim() }
        : {}),
      ...(uiSatisfaction !== null ? { ui_satisfaction: uiSatisfaction } : {}),
      ...(usageFrequency ? { usage_frequency: usageFrequency } : {}),
      ...(additionalComments.trim() ? { additional_comments: additionalComments.trim() } : {}),
    };

    const cleanValue = (val?: string | null) => (val ? val.replace(/"/g, '').trim() : '');

    const userLoginValue =
      cleanValue(userEmail) ||
      cleanValue(Cookie.get('userEmail')) ||
      cleanValue(userInfo?.userLogin) ||
      cleanValue(userName) ||
      'anonymous';

    const userNameValue =
      cleanValue(userInfo?.userName) ||
      cleanValue(superUserName) ||
      cleanValue(Cookie.get('suName')) ||
      cleanValue(userName) ||
      undefined;

    const res = await submitFeedback(responses, {
      userLogin: userLoginValue,
      userName: userNameValue,
      client: userInfo?.client || tenantData?.alias || undefined,
      token: token || undefined,
      userUuid: superUser ? (ui || null) : null,
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsSubmitted(true);
    } else {
      setSubmitError(res.error || 'Failed to submit feedback. Please try again.');
    }
  };

  // Temporary: Only display feedback sidebar for superusers
  if (!superUser) {
    return null;
  }

  return (
    <div
      className={`${styles['feedback-backdrop']} ${
        isAnimatedOpen ? styles['feedback-backdrop--open'] : ''
      }`}
      onClick={closeFeedback}
      aria-hidden={!isAnimatedOpen}
    >
      <div
        className={`${styles['feedback-drawer']} ${
          isAnimatedOpen ? styles['feedback-drawer--open'] : ''
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="feedback-drawer-title"
      >
        {/* Aurora Hero Header */}
        <div className={styles['header']}>
          <div className={styles['header__grid']} />
          <div className={styles['header__orb-blue']} />
          <div className={styles['header__orb-purple']} />

          <div className={styles['header__top']}>
            <div className={styles['header__brand']}>
              <div className={styles['header__emblem']}>
                <Icon name="questionnaire" />
                <span className={styles['header__emblem-star']}>
                  <Icon name="star" />
                </span>
              </div>
              <div className={styles['header__info']}>
                <span className={styles['header__eyebrow']}>
                  <span className={styles['header__eyebrow-dot']} />
                  WAPI UI EXPERIENCE SURVEY
                </span>
                <h2 id="feedback-drawer-title" className={styles['header__title']}>
                  Feedback &amp;{' '}
                  <span className={styles['header__title-accent']}>Suggestions</span>
                </h2>
                <p className={styles['header__subtitle']}>
                  Help us craft a faster, smarter workspace for your daily work
                </p>
              </div>
            </div>

            <button
              type="button"
              className={styles['header__close']}
              onClick={closeFeedback}
              aria-label="Close feedback drawer"
              title="Close"
            >
              ✕
            </button>
          </div>

          {!isSubmitted && (
            <div className={styles['progress-bar']}>
              <div className={styles['progress-bar__meta']}>
                <span className={styles['progress-bar__label']}>
                  Completion Progress
                </span>
                <span className={styles['progress-bar__count']}>
                  <strong>{answeredCount}</strong> of {totalQuestions} answered
                </span>
              </div>
              <div className={styles['progress-bar__track']}>
                <div
                  className={styles['progress-bar__fill']}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        {isSubmitted ? (
          <div className={styles['success-state']}>
            <div className={styles['success-state__card']}>
              <div className={styles['success-state__icon-ring']}>
                <div className={styles['success-state__icon']}>
                  <Icon name={'biggest-check'} />
                </div>
              </div>
              <span className={styles['success-state__badge']}>FEEDBACK RECEIVED</span>
              <h3 className={styles['success-state__title']}>
                Thank You for Your Feedback!
              </h3>
              <p className={styles['success-state__text']}>
                Your opinions and suggestions directly guide our product and UI roadmap.
                Remember, the <strong>&ldquo;Feedback &amp; Wishes&rdquo;</strong> button is always here whenever you think of something new!
              </p>
              <button
                type="button"
                className={styles['cta-submit-btn']}
                onClick={closeFeedback}
              >
                <span className={styles['cta-submit-btn__shimmer']} />
                <span className={styles['cta-submit-btn__text']}>Done</span>
              </button>
            </div>
          </div>
        ) : (
          <form className={styles['content']} onSubmit={handleSubmit}>
            {submitError && (
              <div className={styles['error-banner']}>{submitError}</div>
            )}

            {/* Q1: Frequent sections */}
            <div
              ref={q1Ref}
              className={`${styles['question-block']} ${
                q1Error ? styles['has-error'] : ''
              } ${isQ1Valid ? styles['is-answered'] : ''}`}
            >
              <div className={styles['question-block__header']}>
                <span
                  className={`${styles['question-badge']} ${
                    isQ1Valid ? styles['question-badge--done'] : ''
                  }`}
                >
                  {isQ1Valid ? <Icon name={'check'} className={styles["scale-check"]}/> : '1'}
                </span>
                <div className={styles['question-block__titles']}>
                  <label className={styles['question-block__label']}>
                    Which sections of WAPI UI do you use most frequently?{' '}
                    <span className={styles['required-star']}>*</span>
                  </label>
                  <span className={styles['question-block__hint']}>Select all that apply</span>
                </div>
              </div>
              {q1Error && <p className={styles['question-error-text']}>⚠ {q1Error}</p>}
              <div className={styles['checkboxes-list']}>
                {FREQUENT_SECTIONS_OPTIONS.map((option) => (
                  <Checkbox
                    key={option}
                    name={`q1_${option.toLowerCase().replace(/\s+/g, '_')}`}
                    label={option}
                    hasHover={true}
                    checked={frequentSections.includes(option)}
                    onChange={() =>
                      toggleArrayItem(frequentSections, option, setFrequentSections)
                    }
                  />
                ))}
                <Checkbox
                  name="q1_other"
                  label="Other sections"
                  hasHover={true}
                  checked={hasOtherSection}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setHasOtherSection(e.target.checked)
                  }
                />
                {hasOtherSection && (
                  <div className={styles['other-text']}>
                    <TextField
                      name="frequentSectionsOther"
                      isRequired={true}
                      placeholder="Specify which sections..."
                      value={frequentSectionsOther}
                      errorMessage={
                        hasOtherSection && hasAttemptedSubmit && !frequentSectionsOther.trim()
                          ? 'Please specify which sections'
                          : undefined
                      }
                      onChange={(val: string) => setFrequentSectionsOther(val)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Q2: Workflow slowdowns */}
            <div
              ref={q2Ref}
              className={`${styles['question-block']} ${
                q2Error ? styles['has-error'] : ''
              } ${isQ2Valid ? styles['is-answered'] : ''}`}
            >
              <div className={styles['question-block__header']}>
                <span
                  className={`${styles['question-badge']} ${
                    isQ2Valid ? styles['question-badge--done'] : ''
                  }`}
                >
                  {isQ2Valid ? <Icon name={'check'} className={styles["scale-check"]}/> : '2'}
                </span>
                <div className={styles['question-block__titles']}>
                  <label className={styles['question-block__label']}>
                    What slows down your workflow the most?{' '}
                    <span className={styles['required-star']}>*</span>
                  </label>
                  <span className={styles['question-block__hint']}>Select all that apply</span>
                </div>
              </div>
              {q2Error && <p className={styles['question-error-text']}>⚠ {q2Error}</p>}
              <div className={styles['checkboxes-list']}>
                {SLOWDOWNS_OPTIONS.map((option) => (
                  <React.Fragment key={option}>
                    <Checkbox
                      name={`q2_${option.toLowerCase().replace(/\s+/g, '_')}`}
                      label={option}
                      hasHover={true}
                      checked={workflowSlowdowns.includes(option)}
                      onChange={() =>
                        toggleArrayItem(workflowSlowdowns, option, setWorkflowSlowdowns)
                      }
                    />
                    {option === 'Missing features' && hasMissingFeatures && (
                      <div className={styles['other-text']}>
                        <TextField
                          name="missingFeaturesText"
                          isRequired={true}
                          placeholder="Specify which features are missing..."
                          value={missingFeaturesText}
                          errorMessage={
                            hasMissingFeatures && hasAttemptedSubmit && !missingFeaturesText.trim()
                              ? 'Please specify which features are missing'
                              : undefined
                          }
                          onChange={(val: string) => setMissingFeaturesText(val)}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
                <Checkbox
                  name="q2_other"
                  label="Other issues"
                  hasHover={true}
                  checked={hasOtherSlowdowns}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setHasOtherSlowdowns(e.target.checked)
                  }
                />
                {hasOtherSlowdowns && (
                  <div className={styles['other-text']}>
                    <TextField
                      name="workflowSlowdownsOther"
                      isRequired={true}
                      placeholder="Specify which issues..."
                      value={workflowSlowdownsOther}
                      errorMessage={
                        hasOtherSlowdowns && hasAttemptedSubmit && !workflowSlowdownsOther.trim()
                          ? 'Please specify which issues'
                          : undefined
                      }
                      onChange={(val: string) => setWorkflowSlowdownsOther(val)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Q3: Dashboard information */}
            <div
              ref={q3Ref}
              className={`${styles['question-block']} ${
                q3Error ? styles['has-error'] : ''
              } ${isQ3Valid ? styles['is-answered'] : ''}`}
            >
              <div className={styles['question-block__header']}>
                <span
                  className={`${styles['question-badge']} ${
                    isQ3Valid ? styles['question-badge--done'] : ''
                  }`}
                >
                  {isQ3Valid ? <Icon name={'check'} className={styles["scale-check"]}/> : '3'}
                </span>
                <div className={styles['question-block__titles']}>
                  <label className={styles['question-block__label']}>
                    What information would you like to see on your Dashboard to help your daily work?{' '}
                    <span className={styles['required-star']}>*</span>
                  </label>
                  <span className={styles['question-block__hint']}>Select all that apply</span>
                </div>
              </div>
              {q3Error && <p className={styles['question-error-text']}>⚠ {q3Error}</p>}
              <div className={styles['checkboxes-list']}>
                {DASHBOARD_INFO_OPTIONS.map((option) => (
                  <Checkbox
                    key={option.title}
                    classNames="multiline-checkbox"
                    name={`q3_${option.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`}
                    label={
                      <div className={styles['multiline-option']}>
                        <span className={styles['multiline-option__title']}>{option.title}</span>
                        <span className={styles['multiline-option__desc']}>({option.desc})</span>
                      </div>
                    }
                    hasHover={true}
                    checked={dashboardInfo.includes(option.title)}
                    onChange={() => {
                      const withoutNone = dashboardInfo.filter((x) => x !== DASHBOARD_NONE_OPTION);
                      toggleArrayItem(withoutNone, option.title, setDashboardInfo);
                    }}
                  />
                ))}
                <Checkbox
                  name="q3_none"
                  label={DASHBOARD_NONE_OPTION}
                  hasHover={true}
                  checked={dashboardInfo.includes(DASHBOARD_NONE_OPTION)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                      setDashboardInfo([DASHBOARD_NONE_OPTION]);
                      setHasOtherDashboardInfo(false);
                      setDashboardInfoOther('');
                    } else {
                      setDashboardInfo([]);
                    }
                  }}
                />
                <Checkbox
                  name="q3_other"
                  label="Other"
                  hasHover={true}
                  checked={hasOtherDashboardInfo}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                      setDashboardInfo((prev) => prev.filter((x) => x !== DASHBOARD_NONE_OPTION));
                    }
                    setHasOtherDashboardInfo(e.target.checked);
                  }}
                />
                {hasOtherDashboardInfo && (
                  <div className={styles['other-text']}>
                    <TextField
                      name="dashboardInfoOther"
                      isRequired={true}
                      placeholder="Specify what information you would like to see..."
                      value={dashboardInfoOther}
                      errorMessage={
                        hasOtherDashboardInfo && hasAttemptedSubmit && !dashboardInfoOther.trim()
                          ? 'Please specify what information you would like to see'
                          : undefined
                      }
                      onChange={(val: string) => setDashboardInfoOther(val)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Q4: Priority improvements */}
            <div
              ref={q4Ref}
              className={`${styles['question-block']} ${
                q4Error ? styles['has-error'] : ''
              } ${isQ4Valid ? styles['is-answered'] : ''}`}
            >
              <div className={styles['question-block__header']}>
                <span
                  className={`${styles['question-badge']} ${
                    isQ4Valid ? styles['question-badge--done'] : ''
                  }`}
                >
                  {isQ4Valid ? <Icon name={'check'} className={styles["scale-check"]}/> : '4'}
                </span>
                <div className={styles['question-block__titles']}>
                  <label className={styles['question-block__label']}>
                    What would you like to see improved first?{' '}
                    <span className={styles['required-star']}>*</span>
                  </label>
                  <span className={styles['question-block__hint']}>Select all that apply</span>
                </div>
              </div>
              {q4Error && <p className={styles['question-error-text']}>⚠ {q4Error}</p>}
              <div className={styles['checkboxes-list']}>
                {IMPROVEMENTS_OPTIONS.map((option) => (
                  <Checkbox
                    key={option}
                    name={`q4_${option.toLowerCase().replace(/\s+/g, '_')}`}
                    label={option}
                    hasHover={true}
                    checked={priorityImprovements.includes(option)}
                    onChange={() =>
                      toggleArrayItem(priorityImprovements, option, setPriorityImprovements)
                    }
                  />
                ))}
                <Checkbox
                  name="q4_other"
                  label="Other"
                  hasHover={true}
                  checked={hasOtherImprovement}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setHasOtherImprovement(e.target.checked)
                  }
                />
                {hasOtherImprovement && (
                  <div className={styles['other-text']}>
                    <TextField
                      name="priorityImprovementsOther"
                      isRequired={true}
                      placeholder="Specify what you would like improved..."
                      value={priorityImprovementsOther}
                      errorMessage={
                        hasOtherImprovement && hasAttemptedSubmit && !priorityImprovementsOther.trim()
                          ? 'Please specify what you would like improved'
                          : undefined
                      }
                      onChange={(val: string) => setPriorityImprovementsOther(val)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Q5: UI satisfaction (Likert Scale) */}
            <div
              ref={q5Ref}
              className={`${styles['question-block']} ${
                q5Error ? styles['has-error'] : ''
              } ${isQ5Valid ? styles['is-answered'] : ''}`}
            >
              <div className={styles['question-block__header']}>
                <span
                  className={`${styles['question-badge']} ${
                    isQ5Valid ? styles['question-badge--done'] : ''
                  }`}
                >
                  {isQ5Valid ? <Icon name={'check'} className={styles["scale-check"]}/> : '5'}
                </span>
                <div className={styles['question-block__titles']}>
                  <label className={styles['question-block__label']}>
                    How user-friendly do you find the current interface?{' '}
                    <span className={styles['required-star']}>*</span>
                  </label>
                </div>
              </div>
              {q5Error && <p className={styles['question-error-text']}>⚠ {q5Error}</p>}
              <div className={styles['rating-row']}>
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    type="button"
                    className={`${styles['rating-btn']} ${
                      uiSatisfaction === score ? styles['rating-btn--active'] : ''
                    }`}
                    onClick={() => setUiSatisfaction(score)}
                  >
                    <span className={styles['rating-btn__number']}>{score}</span>
                    <span className={styles['rating-btn__desc']}>
                      {SATISFACTION_LABELS[score]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Q6: Usage frequency */}
            <div
              ref={q6Ref}
              className={`${styles['question-block']} ${
                q6Error ? styles['has-error'] : ''
              } ${isQ6Valid ? styles['is-answered'] : ''}`}
            >
              <div className={styles['question-block__header']}>
                <span
                  className={`${styles['question-badge']} ${
                    isQ6Valid ? styles['question-badge--done'] : ''
                  }`}
                >
                  {isQ6Valid ? <Icon name={'check'} className={styles["scale-check"]}/> : '6'}
                </span>
                <div className={styles['question-block__titles']}>
                  <label className={styles['question-block__label']}>
                    How often do you use WAPI UI?{' '}
                    <span className={styles['required-star']}>*</span>
                  </label>
                </div>
              </div>
              {q6Error && <p className={styles['question-error-text']}>⚠ {q6Error}</p>}
              <div className={styles['frequency-grid']}>
                {FREQUENCY_OPTIONS.map((opt) => {
                  const isSelected = usageFrequency === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={`${styles['frequency-card']} ${
                        isSelected ? styles['frequency-card--active'] : ''
                      }`}
                      onClick={() => setUsageFrequency(opt.value)}
                    >
                      <span className={styles['frequency-card__text']}>{opt.label}</span>
                      {isSelected && (
                        <span className={styles['frequency-card__indicator']}>
                          <Icon name='check' />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Q7: Additional suggestions */}
            <div
              ref={q7Ref}
              className={`${styles['question-block']} ${styles['additional-question']}  ${isQ7Valid ? styles['is-answered'] : ''}`}
            >
              <div className={styles['question-block__header']}>
                <span
                  className={`${styles['question-badge']} ${
                    isQ7Valid ? styles['question-badge--done'] : ''
                  }`}
                >
                  {isQ7Valid ? <Icon name={'check'} className={styles["scale-check"]}/> : '7'}
                </span>
                <div className={styles['question-block__titles']}>
                  <label className={styles['question-block__label']}>
                    Is there anything else you would like to see changed or added?
                    {/*<span className={styles['required-star']}>*</span>*/}
                  </label>
                  <span className={styles['question-block__hint']}>Optional</span>
                </div>
              </div>
              <TextArea
                name="additionalComments"
                label=""
                isRequired={false}
                placeholder="Share any specific suggestions, pain points, or ideas..."
                value={additionalComments}
                // errorMessage={q7Error || undefined}
                onChange={(val: string) => setAdditionalComments(val)}
                rows={4}
              />
            </div>

            {/* Footer Buttons */}
            <div className={styles['footer']}>
              {submitError && (
                <div className={styles['error-banner']}>{submitError}</div>
              )}
              <div className={styles['footer__buttons']}>
                <button
                  type="button"
                  className={styles['cancel-btn']}
                  onClick={closeFeedback}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles['cta-submit-btn']}
                  disabled={isSubmitting || !hasAnyAnswer}
                >
                  <span className={styles['cta-submit-btn__shimmer']} />
                  <span className={styles['cta-submit-btn__text']}>
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </span>
                  {!isSubmitting && (
                    <span className={styles['cta-submit-btn__arrow']}>→</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackDrawer;
