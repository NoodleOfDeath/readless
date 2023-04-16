
import { PublicSummaryAttributes, ReleaseAttributes } from '~/api';

export type DialogContextType = {
  showFeedbackDialog?: boolean;
  setShowFeedbackDialog: React.Dispatch<React.SetStateAction<boolean>>;
  feedbackSubject?: PublicSummaryAttributes;
  setFeedbackSubject: React.Dispatch<React.SetStateAction<PublicSummaryAttributes | undefined>>;
  showReleaseNotes?: boolean;
  setShowReleaseNotes: React.Dispatch<React.SetStateAction<boolean>>;
  releaseNotes?: ReleaseAttributes[];
  setReleaseNotes: React.Dispatch<React.SetStateAction<ReleaseAttributes[]>>
};

export const DEFAULT_DIALOG_CONTEXT: DialogContextType = {
  feedbackSubject: undefined,
  releaseNotes: [],
  setFeedbackSubject: () => {
    /** placeholder */
  },
  setReleaseNotes: () => {
    /** placeholder */
  },
  setShowFeedbackDialog: () => {
    /** placeholder */
  },
  setShowReleaseNotes: () => {
    /** placeholder */
  },
  showFeedbackDialog: false,
  showReleaseNotes: false,
};