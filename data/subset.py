USERS = set()
q = open('QUESTION_USERS')
q.readline()
for line in q:
  USERS.add(line.split('\t')[0])

points = open('POST_DATA2')
print points.readline().strip()
for line in points:
  if line.split('\t')[0] in USERS:
    print line.strip()
