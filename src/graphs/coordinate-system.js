class LineSegment {
  constructor (x1, y1, x2, y2) {
    this.x1 = x1
    this.x2 = x2
    this.y1 = y1
    this.y2 = y2
  }

  setStartPoint (x1, y1) {
    this.x1 = x1
    this.y1 = y1
  }

  setEndPoint (x2, y2) {
    this.x2 = x2
    this.y2 = y2
  }
}

class Line {
  constructor (k, n) {
    this.k = k
    this.n = n
  }

  setK (k) {
    this.k = k
  }

  setN (n) {
    this.n = n
  }
}

class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  setX (x) {
    this.x = x
  }

  setY (y) {
    this.y = y
  }
}

class Rectangle {
  constructor (x1, y1, x2, y2) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
  }
}

// Coordinate System with elements.
class CoordinateSystem {
  constructor (canvas) {
    this.canvas = canvas

    this.scaleFont = '14px Arial'
    this.lineWidth = 0.6
    this.gridLineWidth = 0.10
    this.borderLineWidth = 2
    this.pointLineWidth = 1
    this.minScale = 20

    this.center = { x: canvas.width / 2, y: canvas.height / 2 }

    this.lineSegments = []
    this.lines = []
    this.points = []
    this.functions = []
    this.rectangles = []

    this.xScale = 80
    this.yScale = 80

    this.mousePressed = false
    this.mousePanStartX = 0
    this.mousePanStartY = 0
    this.pannable = true
    this.mouseStopTimeout = null
    this.mouseStopped = false

    const self = this
    this.canvas.addEventListener('mousedown',
      function (e) {
        self.startPanning(e)
      })
    this.canvas.addEventListener('mouseup',
      function (e) {
        self.mousePressed = false
      })
    this.canvas.addEventListener('mouseout',
      function (e) {
        self.mousePressed = false
        self.mouseStopped = false
        console.log('mouse out bby')
        clearTimeout(self.mouseStopTimeout)
        self.draw()
      })
    this.canvas.addEventListener('wheel',
      function (e) {
        self.zoom(e)
      })
    this.canvas.addEventListener('mousemove',
      function (e) {
        clearTimeout(self.mouseStopTimeout)
        self.mouseStopTimeout = setTimeout(() => self.onMouseStop(e), 500)
        self.pan(e)
      })
    this.canvas.addEventListener('dblclick',
      function (e) {
        self.resetZoom()
      })
  }

  onMouseStop (e) {
    this.draw()
    this.mouseStopped = true
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const ctx = this.canvas.getContext('2d')
    const tekst = '(' + this.convertCanvasXToCoordinateX(x).toFixed(2) + ', ' + this.convertCanvasYToCoordinateY(y).toFixed(2) + ')'
    ctx.lineWidth = this.borderLineWidth
    ctx.beginPath()
    ctx.setLineDash([5, 10])
    ctx.moveTo(x, y)
    ctx.lineTo(x, this.convertCoordinateYToCanvasY(0))
    ctx.moveTo(x, y)
    ctx.lineTo(this.convertCoordinateXToCanvasX(0), y)
    ctx.fillText(tekst, x, y)
    ctx.arc(x, y, 3, 0, 2 * Math.PI, true)
    ctx.stroke()
    const prevStrokeSTyle = ctx.strokeStyle
    ctx.strokeStyle = '#eb3737'
    ctx.stroke()
    ctx.setLineDash([])
    ctx.strokeStyle = prevStrokeSTyle
  }

  resetZoom () {
    this.xScale = 80
    this.yScale = 80
    this.draw()
  }

  convertCanvasXToCoordinateX (canvasX) {
    return (canvasX - this.center.x) / this.xScale
  }

  convertCanvasYToCoordinateY (canvasY) {
    return -(canvasY - this.center.y) / this.yScale
  }

  convertCoordinateXToCanvasX (x) {
    return x * this.xScale + this.center.x
  }

  convertCoordinateYToCanvasY (y) {
    return -y * this.yScale + this.center.y
  }

  startPanning (e) {
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    this.mousePressed = true
    this.mousePanStartX = x
    this.mousePanStartY = y
  }

  setPannable (boolean) {
    this.pannable = boolean
  }

  zoom (e) {
    e.preventDefault()
    const oldScaleX = this.xScale
    const oldScaleY = this.yScale

    this.xScale = Math.max(this.xScale - e.deltaY * 2, this.minScale)
    this.yScale = Math.max(this.yScale - e.deltaY * 2, this.minScale)

    const scaleDeltaX = this.xScale - oldScaleX
    const scaleDeltaY = this.yScale - oldScaleY

    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const norma = Math.sqrt(((x - this.center.x) / this.xScale) ** 2 + ((y - this.center.y) / this.yScale) ** 2)

    const xdelta = (x - this.center.x) / norma * scaleDeltaX / this.xScale * Math.abs(this.convertCanvasXToCoordinateX(x))
    const ydelta = (y - this.center.y) / norma * scaleDeltaY / this.yScale * Math.abs(this.convertCanvasYToCoordinateY(y))

    this.center.x -= xdelta
    this.center.y -= ydelta

    this.draw()
  }

  pan (e) {
    if (this.mouseStopped) {
      this.mouseStopped = false
      this.draw()
    }
    if (this.mousePressed && this.pannable) {
      const rect = e.target.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const xdelta = x - this.mousePanStartX
      const ydelta = y - this.mousePanStartY
      this.center.x += xdelta
      this.mousePanStartX += xdelta
      this.center.y += ydelta
      this.mousePanStartY += ydelta
      this.draw()
    }
  }

  drawBorder () {
    const canvas = this.canvas
    const ctx = this.canvas.getContext('2d')
    ctx.lineWidth = this.borderLineWidth
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(canvas.width, 0)
    ctx.lineTo(canvas.width, canvas.height)
    ctx.lineTo(0, canvas.height)
    ctx.closePath()
    ctx.stroke()
  }

  drawAxis () {
    const canvas = this.canvas
    const ctx = canvas.getContext('2d')
    ctx.lineWidth = this.borderLineWidth
    ctx.beginPath()
    ctx.moveTo(this.center.x, 0)
    ctx.lineTo(this.center.x, canvas.height)
    ctx.moveTo(0, this.center.y)
    ctx.lineTo(canvas.width, this.center.y)
    ctx.closePath()
    ctx.stroke()
  }

  drawGrid () {
    const ctx = this.canvas.getContext('2d')

    const numberOfX = Math.floor(this.canvas.width * 10 / this.xScale)
    const numberOfY = Math.floor(this.canvas.height * 10 / this.yScale)

    const xStartCoordinate = Math.ceil(this.convertCanvasXToCoordinateX(0))
    const yStartCoordinate = Math.ceil(this.convertCanvasYToCoordinateY(0))

    const xCanvasStart = this.convertCoordinateXToCanvasX(xStartCoordinate)
    const yCanvasStart = this.convertCoordinateYToCanvasY(yStartCoordinate)

    const beforeAlpha = ctx.globalAlpha
    ctx.globalAlpha = 0.5
    ctx.lineWidth = this.gridLineWidth

    for (let i = -10; i < numberOfX + 10; i++) {
      const canvasX = xCanvasStart + i * this.xScale / 10
      if (i % 10 === 0) {
        ctx.globalAlpha = 1
      }
      ctx.beginPath()
      ctx.moveTo(canvasX, 0)
      ctx.lineTo(canvasX, this.canvas.height)
      ctx.closePath()
      ctx.stroke()
      ctx.globalAlpha = 0.5
    }

    for (let i = -10; i < numberOfY + 10; i++) {
      const canvasY = yCanvasStart + i * this.yScale / 10
      if (yStartCoordinate - i !== 0) {
        if (i % 10 === 0) {
          ctx.globalAlpha = 1
        }
        ctx.beginPath()
        ctx.moveTo(0, canvasY)
        ctx.lineTo(this.canvas.width, canvasY)
        ctx.closePath()
        ctx.stroke()
      }
      ctx.globalAlpha = 0.5
    }

    ctx.globalAlpha = beforeAlpha
  }

  drawScale () {
    const ctx = this.canvas.getContext('2d')

    const numberOfX = Math.floor(this.canvas.width / this.xScale)
    const numberOfY = Math.floor(this.canvas.height / this.yScale)

    const xStartCoordinate = Math.ceil(this.convertCanvasXToCoordinateX(0))
    const yStartCoordinate = Math.ceil(this.convertCanvasYToCoordinateY(0))

    const xCanvasStart = this.convertCoordinateXToCanvasX(xStartCoordinate)
    const yCanvasStart = this.convertCoordinateYToCanvasY(yStartCoordinate)
    ctx.font = this.scaleFont
    for (let i = 0; i <= numberOfX; i++) {
      ctx.beginPath()
      ctx.moveTo(xCanvasStart + i * this.xScale, this.center.y + 5)
      ctx.lineTo(xCanvasStart + i * this.xScale, this.center.y - 5)
      ctx.fillText(xStartCoordinate + i, xCanvasStart + i * this.xScale - 8, this.center.y + 20)
      ctx.closePath()
      ctx.stroke()
    }

    for (let i = 0; i <= numberOfY; i++) {
      const canvasY = yCanvasStart + i * this.yScale
      if (yStartCoordinate - i !== 0) {
        ctx.beginPath()
        ctx.moveTo(this.center.x + 5, canvasY)
        ctx.lineTo(this.center.x - 5, canvasY)
        ctx.fillText(yStartCoordinate - i, this.center.x + 10, canvasY)
        ctx.closePath()
        ctx.stroke()
      }
    }
  }

  drawFunction (fx) {
    let x, y, i, j
    const ctx = this.canvas.getContext('2d')
    const step = 5
    ctx.beginPath()
    ctx.lineWidth = this.lineWidth
    let notStarted = true
    for (i = 0; i < this.canvas.width; i += step) {
      x = this.convertCanvasXToCoordinateX(i)
      y = fx(x)
      j = this.convertCoordinateYToCanvasY(y)
      if (notStarted) {
        ctx.moveTo(i, j)
        notStarted = false
      } else {
        ctx.lineTo(i, j)
      }
    };
    ctx.stroke()
  }

  drawLineSegment (lineSegment) {
    const x1 = this.convertCoordinateXToCanvasX(lineSegment.x1)
    const y1 = this.convertCoordinateYToCanvasY(lineSegment.y1)

    const x2 = this.convertCoordinateXToCanvasX(lineSegment.x2)
    const y2 = this.convertCoordinateYToCanvasY(lineSegment.y2)

    const ctx = this.canvas.getContext('2d')
    ctx.beginPath()
    ctx.lineWidth = this.lineWidth
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.closePath()
    ctx.stroke()
  }

  drawLine (line) {
    const x1 = this.convertCanvasXToCoordinateX(this.canvas.width)
    const x2 = this.convertCanvasXToCoordinateX(0)

    const y1 = line.k * x1 + line.n
    const y2 = line.k * x2 + line.n

    const ctx = this.canvas.getContext('2d')
    ctx.beginPath()
    ctx.lineWidth = this.lineWidth
    ctx.moveTo(this.canvas.width, this.convertCoordinateYToCanvasY(y1))
    ctx.lineTo(0, this.convertCoordinateYToCanvasY(y2))
    ctx.closePath()
    ctx.stroke()
  }

  drawPoint (point) {
    const ctx = this.canvas.getContext('2d')
    const x = this.convertCoordinateXToCanvasX(point.x)
    const y = this.convertCoordinateYToCanvasY(point.y)
    const b4 = ctx.strokeStyle
    ctx.lineWidth = this.pointLineWidth
    ctx.beginPath()
    ctx.strokeStyle = '#FF0000'
    // ctx.fillStyle = '#FF0000'
    ctx.arc(x, y, 3, 0, 2 * Math.PI, true)
    ctx.stroke()
    ctx.strokeStyle = b4
  }

  drawRectangle (rectangle) {
    const ctx = this.canvas.getContext('2d')
    const x1 = this.convertCoordinateXToCanvasX(rectangle.x1)
    const y1 = this.convertCoordinateYToCanvasY(rectangle.y1)
    const x2 = this.convertCoordinateXToCanvasX(rectangle.x2)
    const y2 = this.convertCoordinateYToCanvasY(rectangle.y2)

    const upperLeftX = x1
    const upperLeftY = y2
    const width = x2 - x1
    const height = y1 - y2

    ctx.beginPath()
    ctx.rect(upperLeftX, upperLeftY, width, height)
    ctx.fill()
  }

  addLineSegment (x1, y1, x2, y2) {
    this.lineSegments.push(new LineSegment(x1, y1, x2, y2))
  }

  addLineSegmentWithEndpoints (x1, y1, x2, y2) {
    this.addLineSegment(x1, y1, x2, y2)
    this.addPoint(x1, y1)
    this.addPoint(x2, y2)
  }

  addLine (k, n) {
    const line = new Line(k, n)
    this.lines.push(line)
    return line
  }

  addPoint (x, y) {
    const point = new Point(x, y)
    this.points.push(point)
    return point
  }

  addFunction (fx) {
    this.functions.push(fx)
    return fx
  }

  addRectangle (x1, y1, x2, y2) {
    const rectangle = new Rectangle(x1, y1, x2, y2)
    this.rectangles.push(rectangle)
    return rectangle
  }

  addLineThroughPoints (x1, y1, x2, y2) {
    const k = (y2 - y1) / (x2 - x1)
    const n = y1 - k * x1
    const line = new Line(k, n)
    this.lines.push(line)
    return line
  }

  draw () {
    this.clear()
    this.drawBorder()
    this.drawAxis()
    this.drawScale()
    this.drawGrid()
    this.lineSegments.forEach(lineSegment => this.drawLineSegment(lineSegment))
    this.lines.forEach(line => this.drawLine(line))
    this.points.forEach(point => this.drawPoint(point))
    this.functions.forEach(fx => this.drawFunction(fx))
    this.rectangles.forEach(rectangle => this.drawRectangle(rectangle))
  }

  clear () {
    const ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}

export { Line, CoordinateSystem, Point, LineSegment }
