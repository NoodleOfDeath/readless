# lib imports
from enum import Enum
from pattern.web import Twitter
from pattern.en import tag
from pattern.vector import KNN, count

# local imports
from common import SingletonClass

class SentimentMethod(str, Enum):
  afinn = 'afinn'
  flair = 'flair'
  openai = 'openai'
  pattern = 'pattern'
  polyglot = 'polyglot'
  spacy = 'spacy'
  textblob = 'textblob'
  vader = 'vader'

twitter, knn = Twitter(), KNN()

for i in range(1, 3):
  for tweet in twitter.search('#win OR #fail', start=i, count=100):
    s = tweet.text.lower()
    p = '#win' in s and 'WIN' or 'FAIL'
    v = tag(s)
    v = [word for word, pos in v if pos == 'JJ'] # JJ = adjective
    v = count(v) # {'sweet': 1}
    if v:
        knn.train(v, type=p)

print(knn.classify('sweet potato burger'))
print(knn.classify('stupid autocorrect')) 

class SentimentService(SingletonClass):
  
  def classify(self, text: str, method: SentimentMethod):
    print(text)
    print(method)
  