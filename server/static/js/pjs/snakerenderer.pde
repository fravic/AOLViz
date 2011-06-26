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
          Snake snake = new Snake();
          snakes.put(id, snake);
     }
}

void addSnakeNode(int id, int time, float rad, color col, color stroke) {
     Snake snake = snakes.get(id);
     SnakeNode node = new SnakeNode(snake, time, rad, #000000, #000000);
     snake.addNode(node);
}

class SnakeNode {
    float RAD_RATE = 2;

    int x = 0, y = 0, time = 0;
    float maxRad = 0, curRad = 0;
    color col = #000000, str = #000000;

    SnakeNode(Snake parent, int time, float rad, color col, color str) {
                  this.col = col;
                  this.str = str;
                  this.maxRad = rad;
    }

    void mouseOver() {
    }

    void mouseOut() {
    }
    
    void mouseClicked() {
    }

    void update() {
        if (curRad < maxRad) {
            curRad += RAD_RATE;
            curRad = curRad > maxRad ? maxRad : curRad;
        }

         move();
    }

    void move() {
        x += 5;
        y += 5;
    }

    void draw() {
         fill(col);
         stroke(str);
         ellipse(x, y, curRad*2, curRad*2);
    }
}

class Snake {
      int x = 0, y = 0;
      float speed, ampl, wave;
      
      ArrayList nodes = new ArrayList();

      Snake(float speed, float ampl, float wave) {
                  this.speed = speed;
                  this.ampl = ampl;
                  this.wave = wave;
      }

      void addNode(SnakeNode node) {
           nodes.add(node);
      }

      void update() {
          move();

          for (int i = 0; i < nodes.size(); i++) {
              nodes.get(i).update();
          }               
      }

      void move() {
      }

      void draw() {
          for (int i = 0; i < nodes.size(); i++) {
              nodes.get(i).draw();
          }               
      }
}
