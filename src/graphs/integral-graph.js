import { CoordinateSystem } from './coordinate-system.js'

class IntegralGraph {
  constructor (canvas) {
    this.coordinateSystem = new CoordinateSystem(canvas)
    this.x = 0
    this.h = 0.1
    this.fx = x => Math.sin(x)
    this.numberOfRectangles = 10

    this.from = 0
    this.to = Math.PI

    const self = this
    this.fromPoint = this.coordinateSystem.addPoint(this.from, 0)
    this.movablePoint1 = new MovablePoint(this.coordinateSystem, this.fromPoint)
    this.movablePoint1.addCallBack(point => self.setFrom(point.x))

    this.toPoint = this.coordinateSystem.addPoint(this.to, 0)
    this.movablePoint2 = new MovablePoint(this.coordinateSystem, this.toPoint)
    this.movablePoint2.addCallBack(point => self.setTo(point.x))

    this.fn = this.coordinateSystem.addFunction(this.fx)

    this.coordinateSystem.canvas.addEventListener('mousemove',
      function (e) {
        if (self.movablePoint1.isMovable || self.movablePoint2.isMovable) {
          self.coordinateSystem.canvas.style.cursor = 'w-resize'
        } else {
          self.coordinateSystem.canvas.style.cursor = 'default'
        }
      })

    this.coordinateSystem.draw()
  }

  setNumberOfRectangles (val) {
    this.numberOfRectangles = val
    this.draw()
  }

  setFrom (val) {
    this.from = val
    this.fromPoint.setY(0)
    this.draw()
  }

  setTo (val) {
    this.to = val
    this.toPoint.setY(0)
    this.draw()
  }

  draw () {
    this.coordinateSystem.rectangles = []
    this.h = (this.to - this.from) / this.numberOfRectangles
    for (let n = 1; n <= this.numberOfRectangles; n++) {
      const x1 = Number(this.from) + Number(this.h * (n - 1))
      const x2 = Number(this.from) + Number(this.h * n)
      const y2 = this.fx(x2)
      this.coordinateSystem.addRectangle(x1, 0, x2, y2)
    }

    this.coordinateSystem.draw()
  }
}

class MovablePoint {
  constructor (coordinateSystem, point) {
    this.coordinateSystem = coordinateSystem
    this.point = point

    this.mousePressed = false
    this.pointSelected = false
    this.moving = false
    this.isMovable = false

    this.callBacks = []

    const self = this
    this.coordinateSystem.canvas.addEventListener('mousedown',
      function (e) {
        self.mousePress(e)
      })
    this.coordinateSystem.canvas.addEventListener('mouseup',
      function (e) {
        self.mousePressed = false
        self.moving = false
        self.coordinateSystem.setPannable(true)
      })
    this.coordinateSystem.canvas.addEventListener('mousemove',
      function (e) {
        self.mouseMove(e)
      })
  }

  distance (x, y) { // x and y are canvas coordinates
    const canvasX = this.coordinateSystem.convertCoordinateXToCanvasX(this.point.x)
    const canvasY = this.coordinateSystem.convertCoordinateYToCanvasY(this.point.y)
    return Math.sqrt((x - canvasX) ** 2 + (y - canvasY) ** 2)
  }

  mousePress (e) {
    this.mousePressed = true
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    if (this.distance(x, y) < 20) {
      this.moving = true
      this.coordinateSystem.setPannable(false)
    }
  }

  mouseMove (e) {
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    if (this.distance(x, y) < 20) {
      this.isMovable = true
    } else {
      if (!this.moving) {
        this.isMovable = false
      }
    }
    if (this.moving) {
      const rect = e.target.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      this.point.setX(this.coordinateSystem.convertCanvasXToCoordinateX(x))
      this.point.setY(this.coordinateSystem.convertCanvasYToCoordinateY(y))

      this.update()
    }
  }

  addCallBack (callBack) {
    this.callBacks.push(callBack)
  }

  update () {
    this.callBacks.forEach(callback => callback(this.point)) // point has moved callback
  }
}
export { IntegralGraph }
