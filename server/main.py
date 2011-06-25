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
      template_path = os.path.join(root_dir, '../public'),
      debug = True
    )
    tornado.web.Application.__init__(self, handlers, **settings)

class MainHandler(tornado.web.RequestHandler):
  def get(self):
    self.render('index.html')
class AjaxHandler(tornado.web.RequestHandler):
  def get(self, start, end):
    self.write('{}')

def main():
  http_server = tornado.httpserver.HTTPServer(Application())
  http_server.listen(options.port)
  print 'Running on port %d' % options.port
  tornado.ioloop.IOLoop.instance().start()

if __name__ == '__main__':
  main()     
