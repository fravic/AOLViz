import fileinput
import re
import sys
import time

from itertools import groupby
from nltk import wordpunct_tokenize

from liwc import countcat

URL_RE = re.compile('(.com|www.|http|.net|.gov|.edu)')

def isurl(query):
  if URL_RE.search(query):
    return True
  return False

def isquestion(query):
  tokens = wordpunct_tokenize(query)
  start = frozenset('when|could|should|would|who|what|where|why|how'.split('|'))
  if tokens[0] in start:
    return tokens[0]
  return False

def get_files():
  for line in fileinput.input():
    yield line.strip().split('\t')

if __name__ == '__main__':
  sys.stdout.write('\t'.join(['id', 'nquery', 'nunique', 'npos', 'nneg', 'nwords', 'nurl', 'nquest']) + '\n') #header
  for id, queries in groupby(get_files(), lambda line: line[0]):
    if id == 'AnonID':
      continue
    nquery = 0
    nurl = 0
    nquest = 0
    unique = set()
    npos = 0
    nneg = 0
    nwords = 0

    prev = 0
    differences = []
    for line in queries:
      query = line[1]
      # emotion
      counts = countcat(query)
      npos += counts[0]; nneg += counts[1]; nwords += counts[2]
      # internet competence
      nurl += int(isurl(query))
      nquest += 1#int(isquestion(query))
      # repeat queries
      unique.add(query)
      nquery += 1
      # ts
      current = int(time.mktime(time.strptime(line[2], '%Y-%m-%d %H:%M:%S')))
      if prev != 0 and (current - prev) < 60*60:
        differences.append(current - prev)
      prev = current
    nunique = len(unique)

    if len(differences) > 0:
      avgtime = sum(differences)/len(differences) 
    else:
      avgtime = 0
    sys.stdout.write('%s\t%s\n' % (
      id,
      '\t'.join(str(x) for x in [nquery, nunique, npos, nneg, nwords, nurl, nquest, avgtime])))

