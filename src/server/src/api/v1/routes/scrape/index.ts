import { Article, Reference, Source } from '../../../../schema/v1/models';
import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../../middleware';

import { ChatGPTService, SpiderService } from '../../../../services';
import { ChatMessage } from 'chatgpt';

type Prompt = {
  text: string;
  action: (reply: ChatMessage) => void;
};

const router = Router();

router.post('/', body('url').isString(), validate, async (req, res) => {
  try {
    const { url } = req.body;
    // fetch web content with the spider
    const spider = new SpiderService();
    const loot = await spider.fetch(url);
    // create the prompt action map to be sent to chatgpt
    const articleInfo = Article.empty;
    const prompts: Prompt[] = [
      {
        text: `Please summarize the following article?: ${loot.filteredText}`,
        action: (reply) => (articleInfo.content = reply.text),
      },
      { text: 'Can you give this article a title?', action: (reply) => (articleInfo.title = reply.text) },
      {
        text: 'Can you give this article a single word category?',
        action: (reply) => (articleInfo.category = reply.text),
      },
      {
        text: 'Can you give this article a 1-2 word subcategory?',
        action: (reply) => (articleInfo.subcategory = reply.text),
      },
    ];
    // initialize chatgpt service and send the prompt
    const chatgpt = new ChatGPTService();
    // iterate through prompts
    for (const prompt of prompts) {
      const reply = await chatgpt.send(prompt.text);
      prompt.action(reply);
    }
    console.log(articleInfo);
    // create database entries for the article and news source
    let source = new Source({ title: loot.title, url, rawText: loot.text, filteredText: loot.filteredText });
    source = await source.save();
    let article = new Article(articleInfo);
    article = await article.save();
    const reference = new Reference({ articleId: article.id, sourceId: source.id });
    await reference.save();
    await article.reload();
    res.json(article);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default router;
