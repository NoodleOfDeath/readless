import React from 'react';

export type ShareContent =
  | {
      title?: string;
      message: string;
    }
  | {
      title?: string;
      url: string;
    };

export type ShareOptions = {
  dialogTitle?: string;
  excludedActivityTypes?: Array<string>;
  tintColor?: string;
  subject?: string;
  anchor?: number;
};

export class Share {
  
  static async share(content: ShareContent, options?: ShareOptions) {
    return;
  }
  
}