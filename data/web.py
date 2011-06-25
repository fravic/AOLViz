import fileinput
import re
import sys

from itertools import groupby

from liwc import countcat

URL_RE = re.compile('(.com|www.|http|.net|.gov|.edu)')
def isurl(query):
  if URL_RE.search(query):
    return True
  return False

def get_files():
  for line in fileinput.input():
    yield line.strip().split('\t')


sys.stdout.write('\t'.join(['id', 'nquery', 'nunique', 'npos', 'nneg', 'nwords', 'nurl']) + '\n') #header
for id, queries in groupby(get_files(), lambda line: line[0]):
  if id == 'AnonID':
    continue
  nquery = 0
  nurl = 0
  unique = set()
  npos = 0
  nneg = 0
  nwords = 0
  for line in queries:
    query = line[1]
    # emotion
    counts = countcat(query)
    npos += counts[0]; nneg += counts[1]; nwords += counts[2]
    # internet competence
    nurl += int(isurl(query))
    # repeat queries
    unique.add(query)
    nquery += 1
  nunique = len(unique)
  sys.stdout.write('%s\t%s\t%f\n' % (
    id,
    '\t'.join(str(x) for x in [nquery, nunique, npos, nneg, nwords, nurl]),
    float(nurl)/nquery))
