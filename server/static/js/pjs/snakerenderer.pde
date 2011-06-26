HashMap snakes = new HashMap();

int STATE_ALIVE = 0;
int STATE_DYING = 1;
int STATE_DEAD = 2;

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
        Snake snake = (Snake)i.next().getValue();
        snake.update();
        snake.draw();
    }

    i = snakes.entrySet().iterator();
    while (i.hasNext()) {
        ((Snake)i.next().getValue()).cleanup();
    }
}

void addSnakeIfNotExists(int id, int speed, int amp, int wave) {
    if (!snakes.containsKey(id)) {
        Snake snake = new Snake(id, speed, amp, wave);
        snakes.put(id, snake);
    }
}

void addSnakeNode(int id, int time, float rad, color col) {
    Snake snake = snakes.get(id);
    SnakeNode node = new SnakeNode(snake, time, rad, #000000);
    snake.addNode(node);
}

class SnakeNode {
    int SIZE_MULTIPLIER = 5;

    float RAD_RATE = 0.2;
    float RAD_MOUSE_PADDING = 1;

    Snake parent;
    int state = STATE_ALIVE;
    int x = 0, y = 0, time = 0;
    float targRad = 0, curRad = 0;
    color col = #000000;

    SnakeNode(Snake parent, int time, float rad, color col) {
        this.parent = parent;
        this.time = time;
        this.col = col;
        this.str = str;
        this.targRad = rad * SIZE_MULTIPLIER;
    }

    void update() {
        if (state == STATE_DYING) {
            curRad -= RAD_RATE;
            if (curRad < 0) {
                state = STATE_DEAD;
            }
        }
        else if (curRad < targRad) {
            curRad += RAD_RATE;
            curRad = curRad > targRad ? targRad : curRad;
        }
        move();
    }

    void move() {
        y = 25 * parent.ampl * Math.sin(1/(Math.max(parent.wave, 1) * 50) *
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
    int LIFESPAN_REGEN = 500;
    int AMP_MULTIPLIER = 1;

    int state = STATE_ALIVE;
    int x = 0, y = 0, initX = 0, nextNodeX = 0;
    float speed, ampl, wave;
    int userid;
    int timeToDie;
      
    ArrayList nodes = new ArrayList();
    ArrayList nodeQueue = new ArrayList();

    Snake(int userid, float speed, float ampl, float wave) {
        this.userid = userid;
        this.speed = speed;
        this.ampl = ampl * AMP_MULTIPLIER;
        this.wave = wave;
        this.timeToDie = LIFESPAN_REGEN;

        initX = Math.random()*Application.getWidth();
        y = Math.random()*Application.getHeight();
    }

    void addNode(SnakeNode node) {
        node.x = nextNodeX - node.targRad;
        nextNodeX -= node.targRad * 2;

        nodeQueue.add(node);
    }

    void cleanup() {
        if (state == STATE_DYING) {
            boolean alive = false;
            for (int i = 0; i < nodes.size(); i++) {
                if (nodes.get(i).state != STATE_DEAD) {
                    alive = true;
                }
            }    
            if (!alive) {
                nodes.clear();
                // This causes segfaults  :(
                // snakes.remove(userid);
            }
        }
    }
        
    void update() {
        move();

        if (!nodeQueue.isEmpty()) {
            Snake nextNode = nodeQueue.get(0);
            if (nextNode.time < Application.getDisplayTime()) {
                nodes.add(nextNode);
                nodeQueue.remove(0);

                if (state == STATE_ALIVE) {
                    timeToDie = LIFESPAN_REGEN;
                }
            }
        }

        if (timeToDie < 0) {
            for (int i = 0; i < nodes.size(); i++) {
                nodes.get(i).state = STATE_DYING;
            }
            state = STATE_DYING;
        } else {
            timeToDie -= Application.DISPLAY_RATE / Application.FPS;
        }

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
