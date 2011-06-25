import fileinput
import sys
import time

from liwc import countcat
from web import isurl, isquestion, get_files

print 'id\tts\tpos\tneg\tword\tis_url\tquestion\tclicked'
for line in get_files():
  if len(line) == 3:
    id, query, ts = line
    clicked = 1
  else:
    id, query, ts, _, _ = line
    clicked = 0
  if id == 'AnonID':
    continue
  # emotion
  counts = countcat(query)
  pos = counts[0]; neg = counts[1]; word = counts[2]
  # internet competence
  is_url = int(isurl(query))
  is_question = int(isquestion(query))
  ts = int(time.mktime(time.strptime(ts, '%Y-%m-%d %H:%M:%S')))
  print '\t'.join([str(x) for x in [id, ts, pos, neg, word, is_url, is_question, clicked]])

