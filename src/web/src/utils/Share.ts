
export type ShareContent =
  | {
      title?: string | undefined;
      message: string;
    }
  | {
      title?: string | undefined;
      url: string;
    };

export type ShareOptions = {
  dialogTitle?: string | undefined;
  excludedActivityTypes?: Array<string> | undefined;
  tintColor?: string | undefined;
  subject?: string | undefined;
  anchor?: number | undefined;
};

export function Share() {
  
  const share = async (content: ShareContent, options?: ShareOptions) => {
    return;
  };
  
  return { share };
  
}