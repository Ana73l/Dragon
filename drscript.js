var canvas
var ctx
var cw
var ch
var components = []
var score = 0
var level = 0
var health = 5
var command = "end"
var causeOfDeath1 = "Commands: Up-arrow: Up, Down-Arrow: Down,"
var causeOfDeath2 = "Spacebar: start/shoot. Pess spacebar to start."
var causeOfDeath3 = ""


var startGame = () => {
  canvas = document.getElementById("gameCanvas")
  cw = canvas.width
  ch = canvas.height
  ctx = canvas.getContext("2d")
  window.addEventListener('keydown',dragonMove, true)
  window.addEventListener('keyup', dragonClearMove, true)
  setInterval(updateArea, 20)
}

var clear = () => ctx.clearRect(0,0,cw,ch)

var newGame = () => {
  clear()
  score += 1
  if(score % 100 ==0 )
    generateInvader()
  if(score % 2000 == 1)
    level++
  for(var i = 0; i < components.length; i++) {
    if(components[i].compType == 'projectile') {
      for(var j = 0; j < components.length; j++) {
        if(components[j].compType == 'invader') {
          projectileHit(i,j)
        }
      }
    }
  }
  invActions()
  for(var i = 0; i < components.length; i++) {
    if(components[i].exists) {
      components[i].changeState()
      if(health <= 0) {
        causeOfDeath1 = "Your kingdom has suffered too many casualties!"
        causeOfDeath2 = "Press spacebar to try again."
        causeOfDeath3 = "Your score: " + score
        command = "end"
        endGame()
        break
      }
      components[i].update()
    }
  }
  for(var i = 0; i < components.length; i++) {
    if(!components[i].exists) {
      components.splice(i,1)
    }
  }
}

var endGame = () => {
  clear()
  components.splice(6,components.length-6)
  components[3].width = 200
  components[4].y = 768/2-75
  components[4].dirY = 0
  components[5].reset()
  var a = new Announcement()
  components.push(a)
  for(var i = 0; i < components.length; i++) {
    components[i].changeState()
    components[i].update()
  }
  score = 0
  level = 0
  health = 5
}

var updateArea = () => {
  if(command == "start") {
    newGame()
  }
  else if(command =='end') {
    endGame()
  }
}

class Component {
  constructor(x, y, color, width, height, type, compType,exists) {
    this.x = x
    this.y = y
    this.type = type
    this.exists = true
    this.compType = compType
    if(this.type == "image") {
      this.image = new Image()
      this.image.src = color
    }
    else {
      this.color = color
    }
    this.width = width
    this.height = height
    this.dirY = 0
    this.dirX = 0
    components.push(this)
  }
  update() {
    if(this.type == "image") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    else {
      ctx.fillStyle = this.color
      ctx.fillRect(this.x, this.y, this.width, this.height)
    }
  }
  changeState(e) {
    if( this.y <= 50 && this.dirY < 0)
      this.dirY = 0
    if(this.y >= ch - this.height && this.dirY > 0)
      this.dirY = 0

    this.x += this.dirX
    this.y += this.dirY
  }
  clearMove() {
    this.dirX = 0
    this.dirY = 0
  }
  shoot() {
    new Component((this.x + this.width/2 - 60),(this.y + this.height/2 - 15),"fireball.png",30,30,"image","projectile")
    components[components.length-1].dirX = -5
  }
}

class gameScore {
  constructor() {
    this.text = "Score : 0  Level : 1"
    components.push(this)
    this.exists = true
  }
  update() {
    ctx.font = "30px Consolas"
    ctx.fillStyle = "#FFFFFF"
    ctx.fillText(this.text,350,30)
  }
  changeState() {
    this.text = "Score : " + score + "  Level : " + level
  }
  reset() {
    this.text = "Score : 0 Level : 1"
  }
}

class Announcement {
  constuctor() {
    this.text1 = causeOfDeath1
    this.text2 = causeOfDeath2
    this.text3 = causeOfDeath3
    this.exists = true
    this.compType = "Announcement"
  }
  update() {
    ctx.fillStyle = "#000000"
    ctx.fillRect(0,0,1024,768)
    ctx.font = "30px Consolas"
    ctx.fillStyle = "#FFFFFF"
    ctx.fillText(this.text1,0.1*1024,0.4*768)
    ctx.fillText(this.text2,0.1*1024,0.4*768+50)
    ctx.fillText(this.text3,0.1*1024,0.4*768+100)
  }
  changeState() {
    this.text1 = causeOfDeath1
    this.text2 = causeOfDeath2
    this.text3 = causeOfDeath3
  }
}
var background = new Component(0,0,"background.png",1024,768,"image")
//var background = new Component(0,0,"#FFFFFF",1024,768,"color")
var topRect = new Component(0,0,"#000000",1024,50,"color")
var maxHealth = new Component(800,7,"#FF0000",200,30,"color")
var currHealth = new Component(800,7,"green",200,30,"color")
var dragon = new Component(1024 - 250,768/2-75, "theDragon.png", 250, 150, "image")
var theScore = new gameScore()

var projectileHit = (i,j) => {
  if(components[i].x <= components[j].x + components[j].width  &&
    ((((components[i].y >= components[j].y) && (components[i].y + components[i].height <= components[j].y + components[j].height))) ||
      ((components[i].y <= components[j].y) && (components[i].y + components[i].height >= components[j].y)) ||
        ((components[i].y <= components[j].y + components[j].height) && (components[i].y + components[i].height >= components[j].y + components[j].height)))) {
    components[i].exists = false
    components[j].exists = false
  }
}

var dragonMove = (e) => {
  if(e.keyCode == 38)
    dragon.dirY = -6
  if(e.keyCode == 40)
    dragon.dirY = 6
  if(e.keyCode == 32) {
    if(command == "start")
      dragon.shoot()
    else {
      command = "start"
    }
  }
}

var invActions = () => {
  for(var i = 0; i < components.length; i++) {
      if(components[i].compType == 'invader') {
        components[i].dirX = level
        if((components[i].x + components[i].width >= dragon.x + dragon.width/2 - 59) &&
          ((components[i].y >= dragon.y && components[i].y + components[i].height <= dragon.y + dragon.height) ||
          ((components[i].y <= dragon.y) && (components[i].y + components[i].height >= dragon.y + 30)) ||
            ((components[i].y +20 <= dragon.y + dragon.height) && (components[i].y + components[i].height >= dragon.y + dragon.height)))) {
          health --
          currHealth.width = (health * 2 / 10) * maxHealth.width
          components[i].exists = false
        }
        else if(components[i].x >= cw) {
          health --
          currHealth.width = (health * 2 / 10) * maxHealth.width
          components[i].exists = false
        }
      }
      if(components[i].compType == 'projectile')
        if(components[i].x + components[i].width <= 0)
          components[i].exists = false
    }
}

var generateInvader = () => {
  new Component(0,Math.random()*600 + 50,"gargoyle.png",100,100,"image","invader")
  components[components.length-1].dirX = 3
}

var dragonClearMove = () => dragon.clearMove()
