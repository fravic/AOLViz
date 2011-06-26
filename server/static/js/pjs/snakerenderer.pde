// Rounded Corners with Processing.js
// By F1LT3R - http://groups.google.com/group/processingjs
void roundedCorners(int left, int top, int width, int height, int roundness) {
    beginShape();               
    vertex(left + roundness, top);
    vertex(left + width - roundness, top);
    bezierVertex(left + width - roundness, top,
                 left + width, top,
                 left + width, top + roundness);
                          
    vertex(left + width, top + roundness);
    vertex(left + width, top + height - roundness);
    bezierVertex(left + width, top + height - roundness,
                 left + width, top + height,
                 left + width - roundness, top + height);
        
    vertex(left + width - roundness, top + height);
    vertex(left + roundness, top + height);        
    bezierVertex(left + roundness, top + height,
                 left, top + height,
                 left, top + height - roundness);
        
    vertex(left, top + height - roundness);
    vertex(left, top + roundness);
    bezierVertex(left, top + roundness,
                 left, top,
                 left + roundness, top);        
    endShape();
}



HashMap snakes = new HashMap();

int STATE_ALIVE = 0;
int STATE_DYING = 1;
int STATE_DEAD = 2;
int STATE_STOPPED = 3;

float TARG_STOP_FADE = 0.75;
float TARG_STOP_FADE_RATE = 0.15;

SnakeNode globalStopNode = null;
bool globalStop = false;
float globalFade = 0;

void setup() {
    size(Application.getWidth(), Application.getHeight());
    frameRate(24);
    background(#FFFFFF);
}

void draw() {
    Application.update();

    background(#FFFFFF);

    // Fade out during stop
    if (globalStop && globalFade < TARG_STOP_FADE) {
        globalFade += TARG_STOP_FADE_RATE;
        globalFade = globalFade > TARG_STOP_FADE ? TARG_STOP_FADE : globalFade;
    } else if (!globalStop && globalFade > 0) {
        globalFade -= TARG_STOP_FADE_RATE;
        globalFade = globalFade < 0 ? 0 : globalFade;
    }
    
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

    if (globalStop) {
        drawGlobalStopNode();
    }
}

void drawGlobalStopNode() {
    const dialogWidth = 300;
    const dialogHeight = 100;
    const dialogRounding = 5;

    SnakeNode n = globalStopNode;

    fill(#FFFFFF);
    stroke(#000000);
    strokeWeight(1);
    roundedCorners(n.xC, n.yC, dialogWidth, dialogHeight, dialogRounding);

    n.draw();
}

void addSnakeIfNotExists(int id, int speed, int amp, int wave) {
    if (!snakes.containsKey(id)) {
        Snake snake = new Snake(id, speed, amp, wave);
        snakes.put(id, snake);
    }
}

void addSnakeNode(int id, int time, float rad, int r, int g, int b) {
    Snake snake = snakes.get(id);
    SnakeNode node = new SnakeNode(snake, time, rad);
    node.setColor(r, g, b);
    snake.addNode(node);
}

class SnakeNode {
    int SIZE_MULTIPLIER = 5;

    float RAD_RATE = 0.2;
    float RAD_MOUSE_PADDING = 1;

    Snake parent;
    int state = STATE_ALIVE;
    int x = 0, y = 0, xC = 0, yC = 0, time = 0;
    float targRad = 0, curRad = 0;
    color col = #000000;

    SnakeNode(Snake parent, int time, float rad) {
        this.parent = parent;
        this.time = time;
        this.str = str;
        this.targRad = rad * SIZE_MULTIPLIER;
    }

    void setColor(int r, int g, int b) {
        col = color(r, g, b);
    }

    void update() {
        if (state == STATE_DEAD ||
            state == STATE_STOPPED) {
            return;
        }
        if (state == STATE_DYING) {
            curRad -= RAD_RATE;
            if (curRad < 0) {
                state = STATE_DEAD;
            }
        } else {
            if (curRad < targRad) {
                curRad += RAD_RATE;
                curRad = curRad > targRad ? targRad : curRad;
            }
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
        if (state == STATE_DEAD) {
            return;
        }

        xC = (x + parent.x) % Application.getWidth();
        yC = (y + parent.y) % Application.getHeight();

        if (globalFade > 0 && state != STATE_STOPPED) {
            color fade = lerpColor(col, #FFFFFF, globalFade);
            fill(fade);
        } else {
            fill(col);
        }

        if (mouseOver(xC, yC) && state != STATE_DYING) {
            strokeWeight(2);
            stroke(#000000);

            Application.showQuery(parent.userid, time);

            globalStop = true;
            globalStopNode = this;
            parent.state = state = STATE_STOPPED;
        } else {
            noStroke();

            if (state == STATE_STOPPED) {
                Application.hideQuery();
                parent.state = state = STATE_ALIVE;
                globalStop = false;
            }
        }

        ellipse(xC, yC, curRad*2, curRad*2);
    }
}

class Snake {    
    int LIFESPAN_REGEN = 1000;

    float AMP_MULTIPLIER = 1.5;
    float SPEED_MULTIPLIER = 0.8;
    float WAVE_MULTIPLIER = 1.2;

    int state = STATE_ALIVE;
    int x = 0, y = 0, initX = 0, nextNodeX = 0;
    float speed, ampl, wave;
    int userid;
    int timeToDie;
      
    ArrayList nodes = new ArrayList();
    ArrayList nodeQueue = new ArrayList();

    Snake(int userid, float speed, float ampl, float wave) {
        this.userid = userid;
        this.speed = speed * SPEED_MULTIPLIER + Math.random(); // jitter
        this.ampl = ampl * AMP_MULTIPLIER;
        this.wave = wave * WAVE_MULTIPLIER;
        this.timeToDie = LIFESPAN_REGEN;

        initX = Math.random() * Application.getWidth();
        y = (Math.random() + Math.random()) / 2 * Application.getHeight();
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
        if (state == STATE_STOPPED || 
            state  == STATE_DEAD ||
            globalStop) {
            return;
        }

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
