import {
  Get,
  Route,
  Tags,
} from 'tsoa';

import { Document, DocumentAttributes } from '../../schema';

@Route('/v1/document')
@Tags('Document')
export class DocumentController {

  @Get('/privacy')
  public async getPrivacyPolicy(): Promise<DocumentAttributes> {
    return Document.findOne({ where: { name: 'privacy' } });
  }

  @Get('/terms')
  public async getTermsOfService(): Promise<DocumentAttributes> {
    return Document.findOne({ where: { name: 'terms' } });
  }

}
