import { Article, Reference, Source } from '../../../../schema/v1/models';
import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../../middleware';

import { ChatGPTService, SpiderService, Prompt } from '../../../../services';

const router = Router();

router.post('/', body('urls').isArray({ min: 1 }), validate, async (req, res) => {
  try {
    const { urls } = req.body;
    // fetch web content with the spider
    const spider = new SpiderService();
    const loot = await spider.fetch(urls);
    // create the prompt action map to be sent to chatgpt
    const sources: Source[] = [];
    const sourcePrompts = loot.map((gem, i) => {
      const alternateTitle: Prompt = {
        text: gem.filteredText,
        prefix: `Please give this article (Source #${i + 1}) from ${gem.url} titled "${
          gem.title
        }" a new title relevant to its content no longer than 255 characters`,
        action: (reply, sourceInfo: Partial<Source>) => (sourceInfo.alternateTitle = reply.text),
      };
      const abridgedPrompt: Prompt = {
        text: gem.filteredText,
        prefix: `Please summarize the article (Source #${i + 1}) from ${gem.url} titled "${
          gem.title
        }" using at least 800 words and without using phrases like "the article".`,
        action: (reply, sourceInfo: Partial<Source>) => (sourceInfo.abridged = reply.text),
      };
      const summaryPrompt: Prompt = {
        text: gem.filteredText,
        prefix: `Please summarize the article (Source #${i + 1}) from ${gem.url} titled "${
          gem.title
        }" using at 300-400 words without using phrases like "the article".`,
        action: (reply, sourceInfo: Partial<Source>) => (sourceInfo.summary = reply.text),
      };
      const shortSummaryPrompt: Prompt = {
        text: gem.filteredText,
        prefix: `Please summarize the article (Source #${i + 1}) from ${gem.url} titled "${
          gem.title
        }" in exactly 2 sentences without using phrases like "the article".`,
        action: (reply, sourceInfo: Partial<Source>) => (sourceInfo.shortSummary = reply.text),
      };
      const tagsPrompt: Prompt = {
        text: gem.filteredText,
        prefix: `Please provide a list of at least 10 tags most relevant to this article separated by commas like: tag 1,tag 2,tag 3,tag 4,tag 5,tag 6,tag 7,tag 8,tag 9,tag 10`,
        action: (reply, sourceInfo: Partial<Source>) => {
          sourceInfo.tags = reply.text.replace(/^tags:\s*/i, '').split(',');
        },
      };
      const categoryPrompt: Prompt = {
        text: gem.filteredText,
        prefix: `Please provide a one word category for this article`,
        action: (reply, sourceInfo: Partial<Source>) =>
          (sourceInfo.category = reply.text
            .replace(/^category:\s*/i, '')
            .trim()
            .replace(/.$/, '')),
      };
      const subcategoryPrompt: Prompt = {
        text: gem.filteredText,
        prefix: `Please provide a one word subcategory for this article`,
        action: (reply, sourceInfo: Partial<Source>) =>
          (sourceInfo.subcategory = reply.text
            .replace(/^subcategory:\s*/i, '')
            .trim()
            .replace(/.$/, '')),
      };
      return {
        gem,
        prompts: [
          alternateTitle,
          abridgedPrompt,
          summaryPrompt,
          shortSummaryPrompt,
          tagsPrompt,
          categoryPrompt,
          subcategoryPrompt,
        ],
      };
    });
    // initialize chatgpt service and send the prompt
    const chatgpt = new ChatGPTService();
    // iterate through each source prompt and send them to chatgpt
    for (const { gem, prompts } of sourcePrompts) {
      const sourceInfo = Source.json({
        url: gem.url,
        title: gem.title,
        text: gem.text,
        filteredText: gem.filteredText,
      });
      for (const prompt of Object.values(prompts)) {
        const reply = await chatgpt.send(prompt.text, { promptPrefix: prompt.prefix });
        prompt.action(reply, sourceInfo);
      }
      const source = new Source(sourceInfo);
      sources.push(await source.save());
    }
    return res.json({ sources });
    // article creation is suppressed in the first release
    const articleInfo = Article.empty;
    const articlePrompts: Prompt[] = [
      {
        text: `Please write a news article from the previous sources shared with you citing each source by their number as footnotes wherever necessary. Make cross comparisons between the articles, identify possible fact inaccuracies, and provide a conclusion as well. Do not use fewer than 1500 words`,
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
    for (const prompt of articlePrompts) {
      const reply = await chatgpt.send(prompt.text, { promptPrefix: prompt.prefix, timeoutMs: 120000 });
      prompt.action(reply);
    }
    console.log(articleInfo);
    // create database entries for the article and news source
    const article = new Article(articleInfo);
    await article.save();
    await article.reload();
    for (const source of sources) {
      await source.reload();
      const reference = new Reference({ articleId: article.id, sourceId: source.id });
      await reference.save();
    }
    await article.reload();
    res.json(article);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default router;
