from services import SentimentMethod, SentimentService

def main():
  print(SentimentService().classify('fuck', SentimentMethod.afinn))
  
if __name__ == '__main__':
  main()