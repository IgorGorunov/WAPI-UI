import React, { createContext, useContext, useState, useCallback, useEffect, PropsWithChildren } from 'react';
import useAuth from '@/context/authContext';

interface FeedbackContextType {
  isOpen: boolean;
  openFeedback: () => void;
  closeFeedback: () => void;
  isPopupDismissed: boolean;
  dismissPopup: () => void;
}

const FeedbackContext = createContext<FeedbackContextType>({
  isOpen: false,
  openFeedback: () => {},
  closeFeedback: () => {},
  isPopupDismissed: false,
  dismissPopup: () => {},
});

export const FeedbackProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupDismissed, setIsPopupDismissed] = useState(false);
  const { token, ui } = useAuth();

  // Reset popup dismissal state whenever the user logs in, switches session token, or switches user
  useEffect(() => {
    setIsPopupDismissed(false);
  }, [token, ui]);

  const openFeedback = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('wapi_show_feedback_popup_after_login');
    }
    setIsPopupDismissed(true);
    setIsOpen(true);
  }, []);

  const closeFeedback = useCallback(() => {
    setIsOpen(false);
  }, []);

  const dismissPopup = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('wapi_show_feedback_popup_after_login');
    }
    setIsPopupDismissed(true);
  }, []);

  return (
    <FeedbackContext.Provider
      value={{
        isOpen,
        openFeedback,
        closeFeedback,
        isPopupDismissed,
        dismissPopup,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => useContext(FeedbackContext);
export default FeedbackContext;
