import { Summary } from '../../api/v1/schema';
import { BaseService } from '../base';

export class StaticGeneratorService extends BaseService {
  
  public static async generateSitemap() {
    const summaries = await Summary.getSitemapData();
    console.log('summaries retrived', summaries.length);
    const mostSiblings = Math.max(...summaries.map((s) => (s.siblingCount ?? 0))) || 1;
    console.log('most siblings', mostSiblings);
    return `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
              xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
        ${summaries.map((summary) => (`
          <url>
            <loc>https://readless.ai/read?s=${summary.id}</loc>
            <lastmod>${summary.updatedAt.toLocaleDateString()}</lastmod>
            <changefreq>Monthly</changefreq>
            <priority>${(summary.siblingCount ?? 0) / mostSiblings}</priority>
            <news:news>
              <news:publication>
                <news:name>${summary.publisher.displayName}</news:name>
                <news:language>en</news:language>
              </news:publication>
            <news:publication_date>${summary.originalDate.toLocaleDateString()}</news:publication_date>
            <news:title>${summary.title}</news:title>
          </url>`)).join('')}
      </urlset>
    `;
  }
  
}