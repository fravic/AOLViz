import json
import os

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

from tornado.options import define, options

define('port', default=8888, help='run on the given port', type=int)

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

def getdata(start, end):
  sample = {};
  sample[235235] = {'s': 5, 'a': 3, 'w' : 1, 
                    'q': [{'c':[255,0,0],'s':1, 't':1000},
                          {'c':[0,255,0],'s':1, 't':1001}, 
                          {'c':[100,100,100],'s':1, 't':1002},]}
  sample[238235] = {'s': 2, 'a': 3, 'w' : 2, 
                    'q': [{'c':[250,0,250],'s':1, 't':1000},
                          {'c':[100,0,100],'s':2, 't':1002}, 
                          {'c':[235,2,135],'s':1, 't':1002},]}
  return sample

class AjaxHandler(tornado.web.RequestHandler):
  def get(self, start, end):
    self.write(json.dumps(getdata(start, end)))

def main():
  http_server = tornado.httpserver.HTTPServer(Application())
  http_server.listen(options.port)
  print 'Running on port %d' % options.port
  tornado.ioloop.IOLoop.instance().start()

if __name__ == '__main__':
  main()     
