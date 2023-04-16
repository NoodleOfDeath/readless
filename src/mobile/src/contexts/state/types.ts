
import { PublicSummaryAttributes } from '~/api';

export type AppStateContextType = {
  showFeedbackDialog?: boolean;
  setShowFeedbackDialog: React.Dispatch<React.SetStateAction<boolean>>;
  feedbackSubject?: PublicSummaryAttributes;
  setFeedbackSubject: React.Dispatch<React.SetStateAction<PublicSummaryAttributes | undefined>>;
};

export const DEFAULT_APP_STATE_CONTEXT: AppStateContextType = {
  feedbackSubject: undefined,
  setFeedbackSubject: () => {
    /** placeholder */
  },
  setShowFeedbackDialog: () => {
    /** placeholder */
  },
  showFeedbackDialog: false,
};