HashMap snakes = new HashMap();

void setup() {
     size(Application.getWidth(), Application.getHeight());
     frameRate(24);
     background(#FFFFFF);
}

void draw() {
     Application.update();

     background(#FFFFFF);

     Iterator i = snakes.entrySet().iterator();
     while (i.hasNext()) {
         Snake snake = (Snake)i.next();
         snake.getValue().update();
         snake.getValue().draw();
     }
}

void addSnakeIfNotExists(int id, speed, amp, wave) {
     if (!snakes.containsKey(id)) {
          Snake snake = new Snake(speed, amp, wave);
          snakes.put(id, snake);
     }
}

void addSnakeNode(int id, int time, float rad, color col, color stroke) {
     Snake snake = snakes.get(id);
     SnakeNode node = new SnakeNode(snake, time, rad, #000000, #000000);
     snake.addNode(node);
}

class SnakeNode {
    float RAD_RATE = 0.2;
    float RAD_MOUSE_PADDING = 1;

    Snake parent;
    int x = 0, y = 0, time = 0;
    float maxRad = 0, curRad = 0;
    color col = #000000, str = #000000;

    SnakeNode(Snake parent, int time, float rad, color col, color str) {
        this.parent = parent;
        this.time = time;
                  this.col = col;
                  this.str = str;
                  this.maxRad = rad;
                  str = #FF0000;
    }

    void update() {
        if (curRad < maxRad) {
            curRad += RAD_RATE;
            curRad = curRad > maxRad ? maxRad : curRad;
        }

         move();
    }

    void move() {
        y = 25 * parent.ampl * Math.sin(1/(parent.wave * 50) *
                                               (x + parent.x + parent.initX));
    }

    boolean mouseOver(int xC, int yC) {
    dx = xC - mouseX;
    dy = yC - mouseY;
    dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= curRad + RAD_MOUSE_PADDING) {
      return true;
    }
        return false;
    }

    void draw() {
         xC = (x + parent.x) % Application.getWidth();
         yC = (y + parent.y) % Application.getHeight();
         fill(col);

         if (mouseOver(xC, yC)) {
           strokeWeight(2);
           stroke(str);
           fill((col + #FFFFFF) / 2);
         } else {
           noStroke();
         }

         ellipse(xC, yC, curRad*2, curRad*2);
    }
}

class Snake {
      int x = 0, y = 0, initX = 0, nextNodeX = 0;
      float speed, ampl, wave;
      
      ArrayList nodes = new ArrayList();
      ArrayList nodeQueue = new ArrayList();

      Snake(float speed, float ampl, float wave) {
                  this.speed = speed;
                  this.ampl = ampl;
                  this.wave = wave;

                  initX = Math.random()*Application.getWidth();
                  y = Math.random()*Application.getHeight();
      }

      void addNode(SnakeNode node) {
           node.x = nextNodeX - node.maxRad;
           nextNodeX -= node.maxRad * 2;

           nodeQueue.add(node);
      }

      void update() {
      if (!nodeQueue.isEmpty()) {
        Snake nextNode = nodeQueue.get(0);
        if (nextNode.time < Application.getDisplayTime()) {
           nodes.add(nextNode);
           nodeQueue.remove(0);
        }
}

          move();

          for (int i = 0; i < nodes.size(); i++) {
              nodes.get(i).update();
          }               
      }

      void move() {
            x += speed;
      }

      void draw() {
          for (int i = 0; i < nodes.size(); i++) {
              nodes.get(i).draw();
          }               
      }
}
