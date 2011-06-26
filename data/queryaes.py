import sys

q = open('QUERY_QUERY_DATA')
q.readline()

arg = sys.argv[1]
def color(pos, neg):
  if arg == 'mood':
    if pos > neg and pos > 0:
      return (84, 222, 116)
    if neg > pos and neg > 0:
      return (90, 140, 176)
    return (222, 84, 171)
  else:
    return (0, 0, 0)

for line in q:
  (id,ts,pos,neg,word,is_url,question,clicked) = line.split('\t')
  R, G, B = color(pos, neg)
  size = min(word, 9)
  print '%s\t%s\t%d\t%d\t%d\t%d' % (id, ts, R, G, B, size)
