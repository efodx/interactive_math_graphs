import { CoordinateSystem } from './coordinate-system.js'

class LineGraph {
  constructor (canvas) {
    this.coordinateSystem = new CoordinateSystem(canvas)
    this.k = 1
    this.n = 0

    this.line = this.coordinateSystem.addLine(this.k, this.n)

    this.coordinateSystem.draw()
  }

  setK (val) {
    this.k = val
    this.draw()
  }

  setN (val) {
    this.n = val
    this.draw()
  }

  draw () {
    this.line.setK(this.k)
    this.line.setN(this.n)
    this.coordinateSystem.draw()
  }
}
export { LineGraph }
