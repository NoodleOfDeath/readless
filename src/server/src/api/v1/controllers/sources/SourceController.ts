import { Op } from 'sequelize';
import { Get, Path, Query, Route, Tags } from 'tsoa';

import { ReadAndSummarizeSourceOptions } from './types';
import { ChatGPTService, Prompt, SpiderService } from '../../../../services';
import { FindAndCountOptions, SOURCE_ATTRS } from '../../schema/types';
import {
  ReadAndSummarizeSourcePayload,
  Source,
  SourceCreationAttributes,
  SourceWithOutletAttr,
  SourceWithOutletName,
} from '../../schema';

function applyFilter(filter?: string) {
  if (!filter || filter.replace(/\s/g, '').length === 0) return undefined;
  return {
    [Op.or]: [
      { title: { [Op.iRegexp]: filter } },
      { originalTitle: { [Op.iRegexp]: filter } },
      { text: { [Op.iRegexp]: filter } },
      { abridged: { [Op.iRegexp]: filter } },
      { summary: { [Op.iRegexp]: filter } },
      { shortSummary: { [Op.iRegexp]: filter } },
      { bullets: { [Op.contains]: [filter] } },
      { category: { [Op.iRegexp]: filter } },
      { subcategory: { [Op.iRegexp]: filter } },
      { tags: { [Op.contains]: [filter] } },
      { url: { [Op.iRegexp]: filter } },
    ],
  };
}

@Route('/v1/sources')
@Tags('Sources')
export class SourceController {
  @Get('/')
  public async getSources(
    @Query() filter?: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
  ): Promise<{
    count: number;
    rows: SourceWithOutletAttr[];
  }> {
    const options: FindAndCountOptions<Source> = {
      attributes: [...SOURCE_ATTRS],
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
    };
    options.where = applyFilter(filter);
    return await Source.findAndCountAll(options);
  }

  @Get('/:category/')
  public async getSourcesForCategory(
    @Path() category: string,
    @Query() filter?: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
  ): Promise<{
    count: number;
    rows: SourceWithOutletAttr[];
  }> {
    const options: FindAndCountOptions<Source> = {
      attributes: [...SOURCE_ATTRS],
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
      where: {
        [Op.and]: [{ category }, applyFilter(filter)].filter((f) => !!f),
      },
    };
    return await Source.findAndCountAll(options);
  }

  @Get('/:category/:subcategory')
  public async getSourcesForCategoryAndSubcategory(
    @Path() category: string,
    @Path() subcategory: string,
    @Query() filter?: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
  ): Promise<{
    count: number;
    rows: SourceWithOutletAttr[];
  }> {
    const options: FindAndCountOptions<Source> = {
      attributes: [...SOURCE_ATTRS],
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
      where: {
        [Op.and]: [{ category }, { subcategory }, applyFilter(filter)].filter((f) => !!f),
      },
    };
    return await Source.findAndCountAll(options);
  }

  @Get('/:category/:subcategory/:title')
  public async getSourceForCategoryAndSubcategoryAndTitle(
    @Path() category: string,
    @Path() subcategory: string,
    @Path() title: string,
  ): Promise<SourceWithOutletName> {
    const options: FindAndCountOptions<Source> = {
      where: {
        category,
        subcategory,
        title,
      },
    };
    return await Source.findOne(options);
  }

  public async readAndSummarizeSource(
    { url }: ReadAndSummarizeSourcePayload,
    { onProgress, force, outletId, }: ReadAndSummarizeSourceOptions = {},
  ): Promise<Source> {
    if (!outletId) {
      throw new Error('no outlet id specified');
    }
    if (!force) {
      const existingSource = await Source.findOne({ where: { url } });
      if (existingSource) {
        console.log(`Source already exists for ${url}`);
        return existingSource;
      }
    } else {
      console.log(`Forcing source rewrite for ${url}`);
    }
    // fetch web content with the spider
    const spider = new SpiderService();
    const loot = await spider.loot(url);
    // create the prompt action map to be sent to chatgpt
    const sourceInfo = Source.json({
      outletId,
      url: url,
      originalTitle: loot.title,
      rawText: loot.text,
      filteredText: loot.filteredText,
    });
    const prompts: Prompt[] = [
      {
        text: `Please read the following article and provide a single sentence summary using no more than 120 characters\":\n\n${sourceInfo.filteredText}`,
        catchFailure: (reply) => { 
          if (reply.text.length > 120)
            return new Error('Title too long');
        },
        action: (reply) => (sourceInfo.title = reply.text),
      },
      {
        text: 'Please provide 5 concise bullet point sentences no longer than 10 words each for this article',
        catchFailure: (reply) => { 
          if (/^[\s\n]*(?:i'm sorry|sign\s?up)/i.test(reply.text))
            return new Error('Bad response from chatgpt');
        },
        action: (reply) => {
          sourceInfo.bullets = reply.text
            .replace(/^bullets:\s*/i, '')
            .replace(/\.$/, '')
            .split(',')
            .map((bullet) => bullet.trim());
        },
      },
      {
        text: [
          'Please summarize the same article in one sentence using no more than 255 characters.',
          'Please do not use phrases like "the article".',
        ].join(' '),
        catchFailure: (reply) => { 
          if (/^[\s\n]*(?:i'm sorry|sign\s?up)/i.test(reply.text))
            return new Error('Bad response from chatgpt');
        },
        action: (reply) => (sourceInfo.shortSummary = reply.text),
      },
      {
        text: [
          'Please summarize the same article using between 100 and 200 words.',
          'Please do not use phrases like "the article".',
        ].join(' '),
        catchFailure: (reply) => { 
          if (/^[\s\n]*(?:i'm sorry|sign\s?up)/i.test(reply.text))
            return new Error('Bad response from chatgpt');
        },
        action: (reply) => (sourceInfo.summary = reply.text),
      },
      {
        text: [
          'Please summarize the same article using between 300 and 600 words.',
          'Please do not use phrases like "the article".',
        ].join(' '),
        catchFailure: (reply) => { 
          if (/^[\s\n]*(?:i'm sorry|sign\s?up)/i.test(reply.text))
            return new Error('Bad response from chatgpt');
        },
        action: (reply) => (sourceInfo.abridged = reply.text),
      },
      {
        text: [
          'Please summarize the same article using between 600 and 1500 words.',
          'Please do not use phrases like "the article".',
        ].join(' '),
        catchFailure: (reply) => { 
          if (/^[\s\n]*(?:i'm sorry|sign\s?up)/i.test(reply.text))
            return new Error('Bad response from chatgpt');
        },
        action: (reply) => (sourceInfo.text = reply.text),
      },
      {
        text: 'Please provide a list of at least 10 tags most relevant to this article separated by commas like: tag 1,tag 2,tag 3,tag 4,tag 5,tag 6,tag 7,tag 8,tag 9,tag 10',
        catchFailure: (reply) => { 
          if (/^[\s\n]*(?:i'm sorry|sign\s?up)/i.test(reply.text))
            return new Error('Bad response from chatgpt');
        },
        action: (reply) => {
          sourceInfo.tags = reply.text
            .replace(/^tags:\s*/i, '')
            .replace(/\.$/, '')
            .split(',')
            .map((tag) => tag.trim());
        },
      },
      {
        text: 'Please provide a one word category for this article',
        catchFailure: (reply) => { 
          if (/^[\s\n]*(?:i'm sorry|sign\s?up)/i.test(reply.text))
            return new Error('Bad response from chatgpt');
        },
        action: (reply) => (sourceInfo.category = reply.text.replace(/^category:\s*/i, '').replace(/\.$/, '')).trim(),
      },
      {
        text: 'Please provide a one word subcategory for this article',
        catchFailure: (reply) => { 
          if (/^[\s\n]*(?:i'm sorry|sign\s?up)/i.test(reply.text))
            return new Error('Bad response from chatgpt');
        },
        action: (reply) =>
          (sourceInfo.subcategory = reply.text.replace(/^subcategory:\s*/i, '').replace(/\.$/, '')).trim(),
      },
      {
        text: 'Please provide a short image prompt for an ai image generator to make an image for this article',
        catchFailure: (reply) => { 
          if (/^[\s\n]*(?:i'm sorry|sign\s?up)/i.test(reply.text))
            return new Error('Bad response from chatgpt');
        },
        action: (reply) => {
          sourceInfo.imagePrompt = reply.text;
        },
      },
    ];
    // initialize chatgpt service and send the prompt
    const chatgpt = new ChatGPTService();
    // iterate through each source prompt and send them to chatgpt
    for (let n = 0; n < prompts.length; n++) {
      const prompt = prompts[n];
      const reply = await chatgpt.send(prompt.text);
      console.log(reply);
      if (prompt.catchFailure) {
        const error = prompt.catchFailure(reply);
        if (error) { 
          throw error;
        }
      }
      prompt.action(reply);
      if (onProgress) {
        onProgress((n + 1) / prompts.length);
      }
    }
    console.log(sourceInfo);
    const source = new Source(sourceInfo as SourceCreationAttributes);
    await source.save();
    await source.reload();
    if (onProgress) onProgress(1);
    return source;
  }
}
