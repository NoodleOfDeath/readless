import { Get, Path, Query, Route } from 'tsoa';
import { Article, ArticleAttributes } from '../../../../schema/v1/models';
import { FindAndCountOptions } from '../../../../schema/v1/models/types';

@Route('/v1/articles')
export class ArticleController {
  @Get('/')
  public async getArticles(
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
  ): Promise<ArticleAttributes[]> {
    const options: FindAndCountOptions<Article> = {
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
    };
    const sources = await Article.findAndCountAll(options);
    return sources.rows;
  }

  @Get('/:category/')
  public async getArticlesForCategory(
    @Path() category: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
  ): Promise<ArticleAttributes[]> {
    const options: FindAndCountOptions<Article> = {
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
      where: {
        category,
      },
    };
    const sources = await Article.findAndCountAll(options);
    return sources.rows;
  }

  @Get('/:category/:subcategory')
  public async getArticlesForCategoryAndSubCategory(
    @Path() category: string,
    @Path() subcategory: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
  ): Promise<ArticleAttributes[]> {
    const options: FindAndCountOptions<Article> = {
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
      where: {
        category,
        subcategory,
      },
    };
    const sources = await Article.findAndCountAll(options);
    return sources.rows;
  }

  @Get('/:category/:subcategory/:title')
  public async getArticlesForCategoryAndSubCategoryAndTitle(
    @Path() category: string,
    @Path() subcategory: string,
    @Path() title: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
  ): Promise<ArticleAttributes[]> {
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
    const sources = await Article.findAndCountAll(options);
    return sources.rows;
  }
}
