from web import get_files
from math import log
import time
qword = {'how':1, 'what':2, 'where':3, 'who':4, 'why':5, 'could':6, 'should':7, 'would':8, 'when':9}
col1 = ["E41A1C", "377EB8", "4DAF4A", "984EA3", "FF7F00", "FFFF33", "A65628", "F781BF", "999999"]
col2 = ["720D0E", "1B3F5C", "265725", "4C2751", "7F3F00", "7F7F19", "222B14", "7B405F", "4C4C4C"]

col1 = [int(x, 16) for x in col1]
col2 = [int(x, 16) for x in col2]

PERCENT = {}
for line in open('data/wc'):
  word, cnt = line.strip().split()
  PERCENT[word] = float(cnt) *100 / 184344

for line in get_files():
  if len(line) == 4:
    id, query, ts, word = line
    url = False
  else:
    id, query, ts, word, url = line

  if url:
    colour = col2[qword[word]-1]
  else:
    colour = col1[qword[word]-1]
  B = str(colour & 255)
  G = str((colour >> 8) & 255)
  R = str((colour >> 16) & 255)

  size = str(int(max(1,min(log(len(query), 1.4)-5,9))))
  ts = str(int(time.mktime(time.strptime(ts, '%Y-%m-%d %H:%M:%S'))))

  tokens = query.split(' ')
  percents = [PERCENT[token] for token in tokens]

  print '\t'.join([id,ts,R,G,B,size, query, str(percents)])
