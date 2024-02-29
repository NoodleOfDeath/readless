import { JSDOM } from 'jsdom';

const BASE_TEMPLATE_STYLES = `
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .container {
      margin: auto;
      display: flex;
      flex-direction: column;
      background: #fff;
    }

    .header, .footer {
      display: flex;
      justify-content: center;
      background: #333;
      color: white;
      padding: 1rem;
    }

    .content {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      gap: 1rem;
    }

    .article {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0px 2rem;;
    }

    .article-img {
      flex: 3;
    }

    .article-content {
      flex: 7;
    }

    .button {
      background-color: #333;
      border: none;
      color: white;
      padding: 1rem;
      text-align: center;
      font-size: 1rem;
      cursor: pointer;
      border-radius: 0.5rem;
      text-decoration: none;
    }

  </style>
`;

const BASE_TEMPLATE_BODY = <P extends MailTemplateParams>(params: P) => `
  <div class="container">
    <div class="header">
      <h1 id="title" />
    </div>
    <div class="content" id="content" />
    <div class="footer">
      <img src="${params.domain}/logo.svg" alt="Read Less Logo" />
      <p>Read Less - Information Without the Noise</p>
    </div>
  </div>
`;

export type MailTemplateParams = {
  domain: string;
  email: string;
  ssl: boolean;
};

export type MailContentItemType = 'article' | 'button' | 'image' | 'text';

export type MailContentItemProps<
  URL extends string | undefined = undefined,
  T extends MailContentItemType = URL extends string ? 'button' : 'text'
> = {
  type: T;
  title?: string;
  text?: string;
  url?: string;
  img?: string;
  imgAlt?: string;
};

export class MailContentItem<
  URL extends string | undefined = undefined,
  T extends MailContentItemType = URL extends string ? 'button' : 'text'
> {

  type: T = 'text' as T;
  title?: string;
  text?: string;
  url?: string;
  img?: string;
  imgAlt?: string;
  
  constructor({
    type, title, text, url, img, imgAlt,
  }: Partial<MailContentItemProps<URL, T>> = {}) {
    this.type = type || url ? 'button' as T : 'text' as T;
    this.title = title;
    this.text = text;
    this.url = url;
    this.img = img;
    this.imgAlt = imgAlt;
  }

  render() {

    if (this.type === 'text') {
      return `<p>${this.title || this.text}</p>`;
    }
    if (this.type === 'button') {
      return `
        <a href="${this.url}" class="button">${this.title || this.text}</a>
      `.trim();
    }
    if (this.type === 'image') {
      return `<img src="${this.img}" alt="${this.imgAlt || 'Image Description'}">`;
    }

    return `
<div class="article">
  <div class="article-img">
    <img src="${this.img}" alt="${this.imgAlt || 'Image Description'}">
  </div>
  <div class="article-content">
    <h2>${this.title}</h2>
    <p>${this.text}</p>
  </div>
</div>
`.trim();

  }

}

export type MailTemplateProps<Params extends MailTemplateParams> = {
  subject: string;
  title: string;
  params: Params;
  content?: (Partial<MailContentItemProps> | string)[] | Partial<MailContentItemProps> | string
};

// eslint-disable-next-line @typescript-eslint/ban-types
export abstract class MailTemplate<Params extends MailTemplateParams> implements MailTemplateProps<Params> {

  subject: string;
  title: string;
  params: Params;

  document: Document = new JSDOM().window.document;

  constructor({ 
    subject, 
    title,
    content,
    params,
  }: Partial<MailTemplateProps<Params>> = {}) {
    this.subject = subject;
    this.title = title;
    this.params = params;
    this.document.head.innerHTML = BASE_TEMPLATE_STYLES;
    this.document.body.innerHTML = BASE_TEMPLATE_BODY(params);
    const titleElement = this.document.getElementById('title');
    if (titleElement) {
      titleElement.innerHTML = title || subject;
    }
    const contentElement = this.document.getElementById('content');
    if (contentElement) {
      if (content) {
        contentElement.innerHTML = Array.isArray(content) ? content.map(item => {
          if (typeof item === 'string') {
            return item;
          }
          return new MailContentItem(item).render();
        }).join('') : typeof content === 'string' ? content : new MailContentItem(content).render();
      }
    }
  }

  get rendered() {
    return this.document.documentElement.innerHTML;
  }

}