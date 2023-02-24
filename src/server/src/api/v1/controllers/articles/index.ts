import { Body, Get, Query, Path, Post, Route, Tags } from 'tsoa';

import { ChatGPTService, Prompt } from '../../../../services';
import {
  Article,
  ArticleAttr,
  ArticleAttributes,
  ArticleCreationAttributes,
  Reference,
} from '../../../../schema/v1/models';
import { ARTICLE_ATTRS, FindAndCountOptions } from '../../../../schema/v1/models/types';

@Route('/v1/articles')
@Tags('Articles')
export class ArticleController {
  @Get('/')
  public async getArticles(
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
  ): Promise<ArticleAttr[]> {
    const options: FindAndCountOptions<Article> = {
      attributes: [...ARTICLE_ATTRS],
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
    };
    const articles = await Article.findAndCountAll(options);
    return articles.rows;
  }

  @Get('/:category/')
  public async getArticlesForCategory(
    @Path() category: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
  ): Promise<ArticleAttr[]> {
    const options: FindAndCountOptions<Article> = {
      attributes: [...ARTICLE_ATTRS],
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
      where: {
        category,
      },
    };
    const articles = await Article.findAndCountAll(options);
    return articles.rows;
  }

  @Get('/:category/:subcategory')
  public async getArticlesForCategoryAndSubcategory(
    @Path() category: string,
    @Path() subcategory: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
  ): Promise<ArticleAttr[]> {
    const options: FindAndCountOptions<Article> = {
      attributes: [...ARTICLE_ATTRS],
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
      where: {
        category,
        subcategory,
      },
    };
    const articles = await Article.findAndCountAll(options);
    return articles.rows;
  }

  @Get('/:category/:subcategory/:title')
  public async getArticleForCategoryAndSubcategoryAndTitle(
    @Path() category: string,
    @Path() subcategory: string,
    @Path() title: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
  ): Promise<ArticleAttributes> {
    const options: FindAndCountOptions<Article> = {
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
      where: {
        category,
        subcategory,
        title,
      },
    };
    const article = await Article.findOne(options);
    return article;
  }

  @Post('/')
  public async writeArticleFromSources(@Body() sources: number[]): Promise<ArticleAttributes> {
    // article creation is suppressed in the first release
    return null;
    try {
      const articleInfo = Article.empty;
      const prompts: Prompt[] = [
        {
          text: [
            `Please write a news article from the previous sources shared with you citing each source by their number as footnotes wherever necessary.`,
            `Make cross comparisons between the articles, identify possible fact inaccuracies, and provide a conclusion as well.Do not use fewer than 1500 words`,
          ].join(' '),
          action: (reply) => (articleInfo.text = reply.text),
        },
        {
          text: 'Please provide a title for this new article',
          action: (reply) => (articleInfo.title = reply.text),
        },
        {
          text: 'Please provide a single word category for this article',
          action: (reply) => (articleInfo.category = reply.text),
        },
        {
          text: `Please provide a single word subcategory under the category "${articleInfo.category}?"`,
          action: (reply) => (articleInfo.subcategory = reply.text),
        },
        {
          text: 'Plase provide a list of at least 10 tags for this article as a list separated by commas',
          action: (reply) => (articleInfo.tags = reply.text.split(',')),
        },
        {
          text: 'Please provide a 4 to 5 sentence summary for this article without using phrases like "the article"',
          action: (reply) => (articleInfo.summary = reply.text),
        },
        {
          text: 'Pleae provide a 2-sentence summary for this article in without using phrases like "the article"',
          action: (reply) => (articleInfo.shortSummary = reply.text),
        },
      ];
      // iterate through article generation prompts
      const chatgpt = new ChatGPTService();
      for (const prompt of prompts) {
        const reply = await chatgpt.send(prompt.text, { promptPrefix: prompt.prefix });
        prompt.action(reply);
      }
      console.log(articleInfo);
      // create database entries for the article and news source
      const article = new Article(articleInfo as ArticleCreationAttributes);
      await article.save();
      await article.reload();
      for (const source of sources) {
        const reference = new Reference({ articleId: article.id, sourceId: source });
        await reference.save();
      }
      await article.reload();
      return article;
    } catch (e) {
      console.error(e);
    }
  }
}
