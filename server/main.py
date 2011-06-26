import json
import os

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

from collections import defaultdict
from math import ceil
from tornado.options import define, options

define('port', default=8888, help='run on the given port', type=int)

class DataServer(object):
  _BUCKET = 3600
  def __init__(self):
    # users
    self.users = {}
    _users = open('../data/question_user_aes')
    for line in _users:
      id, speed, amp, wave = [int(x) for x in line.strip().split('\t')]
      self.users[id] = {'s':speed, 'a':amp, 'w':wave}
    # ids
    self.queries = defaultdict(lambda:[])
    _queries = open('../data/question_post_aes')
    for line in _queries:
      id, ts, col, size, query  = line.split('\t')
      id = int(id); ts = int(ts); col = int(col); size=int(size)
      self.queries[int(ts)/self._BUCKET].append( (id, ts, col, size, query) )
    for query in self.queries:
      print query

  def getdata(self, start, end):
    ret = {}
    _start = int(start/self._BUCKET)
    _end = int(ceil(float(end)/self._BUCKET))
    for i in range(_start, _end+1):
      print i
      for (id, ts, col, size, _) in self.queries.get(i, []):
        if start < ts and ts < end:
          if not ret.has_key(id):
            ret[id] = self.users[id]
            ret[id]['q'] = []
          ret[id]['q'].append({'c':col, 's':size, 't':ts})
    return ret
dataserver = DataServer()

class Application(tornado.web.Application):
  def __init__(self):
    handlers = [(r'/', MainHandler),
                (r'/data/([0-9]+)/([0-9]+)', AjaxHandler)]
    root_dir = os.path.dirname(__file__)
    settings = dict(
      template_path = os.path.join(root_dir, 'public'),
      static_path = os.path.join(root_dir, 'static'),
      debug = True
    )
    tornado.web.Application.__init__(self, handlers, **settings)

class MainHandler(tornado.web.RequestHandler):
  def get(self):
    self.render('index.html')

class AjaxHandler(tornado.web.RequestHandler):
  def get(self, start, end):
    start = int(start)
    end = int(end)
    self.write(json.dumps(dataserver.getdata(start, end)))

def main():
  http_server = tornado.httpserver.HTTPServer(Application())
  http_server.listen(options.port)
  print 'Running on port %d' % options.port
  tornado.ioloop.IOLoop.instance().start()

if __name__ == '__main__':
  main()     

