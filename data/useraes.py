q = open('question_user')
q.readline()

def speed(time):
  time = float(time)
  if time < 116:
    return 0
  elif time < 154:
    return 1
  elif time < 183:
    return 2
  elif time < 210:
    return 3 
  elif time < 237:
    return 4
  elif time < 264:
    return 5
  elif time < 297:
    return 6
  elif time < 340:
    return 7
  elif time < 411:
    return 8
  return 9

def wave(nquery):
  nquery = float(nquery)
  if nquery < 21.0:
    return 0
  elif nquery < 40.0:
    return 1
  elif nquery < 62.0:
    return 2
  elif nquery < 87.0:
    return 3
  elif nquery < 116.0:
    return 4
  elif nquery < 158.0:
    return 5
  elif nquery < 215.0:
    return 6
  elif nquery < 300.0:
    return 7
  elif nquery < 472.8:
    return 8
  return 9

def amp(nquery):
  return 1

for line in q:
  (id,nquery,nunique,npos,nneg,nwords,nurl,nquest,time) = line.strip().split('\t')
  print '%s\t%d\t%d\t%d' % (id, speed(time), amp(nquery), wave(nquery))
