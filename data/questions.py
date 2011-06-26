import fileinput
import re
import sys
import time

from itertools import groupby
from nltk import wordpunct_tokenize
from web import isurl, isquestion, get_files


for key, lines in groupby(get_files(), lambda line: (line[0], line[1])):
  query = key[1]

  if isurl(query):
    continue

  qword = isquestion(query)
  if not qword:
    continue

  for line in lines:
    answers = []
    if len(line) == 3:
      id, query, ts = line
    else:
      id, query, ts, _, web = line
      answers.append(web)

  if len(answers) == 0:
    ans = ''
  else:
    ans = answers[-1]

  print '\t'.join([id, query, ts, qword, ans])

