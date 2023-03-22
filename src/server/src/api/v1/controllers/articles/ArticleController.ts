import { Op } from 'sequelize';
import {
  Body,
  Get,
  Path,
  Post,
  Query,
  Route,
  Tags,
} from 'tsoa';

import {
  ARTICLE_ATTRS,
  Article,
  ArticleAttr,
  ArticleAttributes,
  BulkResponse,
  FindAndCountOptions,
} from '../../schema';

function applyFilter(filter?: string) {
  if (!filter || filter.replace(/\s/g, '').length === 0) {
    return undefined;
  }
  return {
    [Op.or]: [
      { title: { [Op.iRegexp]: filter } },
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

@Route('/v1/articles')
@Tags('Articles')
export class ArticleController {

  @Get('/')
  public async getArticles(
    @Query() filter?: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page
  ): Promise<BulkResponse<ArticleAttr>> {
    const options: FindAndCountOptions<Article> = {
      attributes: [...ARTICLE_ATTRS],
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']],
    };
    options.where = applyFilter(filter);
    return await Article.findAndCountAll(options);
  }

  @Get('/:category/')
  public async getArticlesForCategory(
    @Path() category: string,
    @Query() filter?: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page
  ): Promise<BulkResponse<ArticleAttr>> {
    const options: FindAndCountOptions<Article> = {
      attributes: [...ARTICLE_ATTRS],
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']],
      where: { [Op.and]: [{ category }, applyFilter(filter)].filter((f) => !!f) },
    };
    return await Article.findAndCountAll(options);
  }

  @Get('/:category/:subcategory')
  public async getArticlesForCategoryAndSubcategory(
    @Path() category: string,
    @Path() subcategory: string,
    @Query() filter?: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page
  ): Promise<BulkResponse<ArticleAttr>> {
    const options: FindAndCountOptions<Article> = {
      attributes: [...ARTICLE_ATTRS],
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']],
      where: { [Op.and]: [{ category }, { subcategory }, applyFilter(filter)].filter((f) => !!f) },
    };
    return await Article.findAndCountAll(options);
  }

  @Get('/:category/:subcategory/:title')
  public async getArticleForCategoryAndSubcategoryAndTitle(
    @Path() category: string,
    @Path() subcategory: string,
    @Path() title: string
  ): Promise<ArticleAttributes> {
    const options: FindAndCountOptions<Article> = {
      where: {
        category,
        subcategory,
        title,
      },
    };
    return await Article.findOne(options);
  }

}
