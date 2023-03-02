import { Op } from 'sequelize';
import { Body, Get, Query, Path, Post, Route, Tags } from 'tsoa';

import { ChatGPTService, Prompt, SpiderService } from '../../../../services';
import {
  ReadAndSummarizeSourcePayload,
  Source,
  SourceAttr,
  SourceAttributes,
  SourceCreationAttributes,
} from '../../schema';
import { FindAndCountOptions, SOURCE_ATTRS } from '../../schema/types';

function applyFilter(filter?: string) {
  if (!filter) return undefined;
  return {
    [Op.or]: [
      { title: { [Op.iRegexp]: filter } },
      { alternateTitle: { [Op.iRegexp]: filter } },
      { abridged: { [Op.iRegexp]: filter } },
      { category: { [Op.iRegexp]: filter } },
      { subcategory: { [Op.iRegexp]: filter } },
      { url: { [Op.iRegexp]: filter } },
      { tags: { [Op.contains]: [filter] } },
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
    rows: SourceAttr[];
  }> {
    const options: FindAndCountOptions<Source> = {
      attributes: [...SOURCE_ATTRS],
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
    };
    if (filter.replace(/\s+/g, '')) {
      options.where = applyFilter(filter);
    }
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
    rows: SourceAttr[];
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
    rows: SourceAttr[];
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
  ): Promise<SourceAttributes> {
    const options: FindAndCountOptions<Source> = {
      where: {
        category,
        subcategory,
        title,
      },
    };
    return await Source.findOne(options);
  }

  @Post('/')
  public async postReadAndSummarizeSource(@Body() { url }: ReadAndSummarizeSourcePayload): Promise<SourceAttributes> {
    return this.readAndSummarizeSource({ url });
  }

  public async readAndSummarizeSource(
    { url }: ReadAndSummarizeSourcePayload,
    onProgress?: (progress: number) => void,
  ): Promise<SourceAttributes> {
    try {
      const existingSource = await Source.findOne({ where: { url } });
      if (existingSource) {
        console.log(`Source already exists for ${url}`);
        return existingSource;
      }
      // fetch web content with the spider
      const spider = new SpiderService();
      const loot = await spider.loot(url);
      const scrapeLoot = (
        await spider.scrape(url, {
          extract_rules: SpiderService.ExtractRules.agelenidae,
        })
      ).collapsed('title', 'text');
      // create the prompt action map to be sent to chatgpt
      const sourceInfo = Source.json({
        url: url,
        title: scrapeLoot.title || loot.title,
        text: scrapeLoot.text || loot.filteredText,
        rawText: loot.text,
      });
      const prompts: Prompt[] = [
        {
          text: scrapeLoot.text || loot.filteredText,
          prefix: `Please give this article a new title relevant to its content no longer than 255 characters`,
          action: (reply) => (sourceInfo.alternateTitle = reply.text),
        },
        {
          text: [
            `Please summarize the same article using between 300 and 800 words.`,
            `Please do not use phrases like "the article".`,
          ].join(' '),
          action: (reply) => (sourceInfo.abridged = reply.text),
        },
        {
          text: [
            `Please summarize the same article using between 100 and 200 words.`,
            `Please do not use phrases like "the article".`,
          ].join(' '),
          action: (reply) => (sourceInfo.summary = reply.text),
        },
        {
          text: [
            `Please summarize the same article in one sentence.`,
            `Please do not use phrases like "the article".`,
          ].join(' '),
          action: (reply) => (sourceInfo.shortSummary = reply.text),
        },
        {
          text: `Please provide a list of at least 10 tags most relevant to this article separated by commas like: tag 1,tag 2,tag 3,tag 4,tag 5,tag 6,tag 7,tag 8,tag 9,tag 10`,
          action: (reply) => {
            sourceInfo.tags = reply.text
              .replace(/^tags:\s*/i, '')
              .replace(/\.$/, '')
              .split(',')
              .map((tag) => tag.trim());
          },
        },
        {
          text: `Please provide a one word category for this article`,
          action: (reply) => (sourceInfo.category = reply.text.replace(/^category:\s*/i, '').replace(/\.$/, '')).trim(),
        },
        {
          text: `Please provide a one word subcategory for this article`,
          action: (reply) =>
            (sourceInfo.subcategory = reply.text.replace(/^subcategory:\s*/i, '').replace(/\.$/, '')).trim(),
        },
      ];
      // initialize chatgpt service and send the prompt
      const chatgpt = new ChatGPTService();
      // iterate through each source prompt and send them to chatgpt
      for (let n = 0; n < prompts.length; n++) {
        const prompt = prompts[n];
        const reply = await chatgpt.send(prompt.text, { promptPrefix: prompt.prefix });
        console.log(reply);
        prompt.action(reply);
        onProgress?.((n + 1) / prompts.length);
      }
      console.log(sourceInfo);
      const source = new Source(sourceInfo as SourceCreationAttributes);
      await source.save();
      await source.reload();
      onProgress?.(1);
      return source;
    } catch (e) {
      console.error(e);
    }
  }
}
