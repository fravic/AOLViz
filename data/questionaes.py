from web import get_files
from math import log
import time
qword = {'who':1, 'what':2, 'when':3, 'where':4, 'why':5, 'how':6, 'could':7, 'should':8, 'would':9}
col1 = ["E41A1C", "377EB8", "4DAF4A", "984EA3", "FF7F00", "FFFF33", "A65628", "F781BF", "999999"]
col2 = ["842326", "005589", "005700", "7E0187", "693F00", "4B4B00", "713900", "8B0067", "414E00"]

col1 = [int(x, 16) for x in col1]
col2 = [int(x, 16) for x in col2]

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
  size = str(int(min(log(len(query), 2),9)))
  ts = str(int(time.mktime(time.strptime(ts, '%Y-%m-%d %H:%M:%S'))))
  print '\t'.join([id,ts,str(colour),size, query])
