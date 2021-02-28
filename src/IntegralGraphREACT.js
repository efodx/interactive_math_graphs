import React from 'react'
import { IntegralGraph } from './graphs/integral-graph.js'
import { Hinput } from './reactinputs/Hinput'

class IntegralGraphREACT extends React.Component {
  componentDidMount () {
    this.integralGraph = new IntegralGraph(this.canvas)
    this.integralGraph.draw()
  }

  setNumberOfRectangles (value) {
    this.integralGraph.setNumberOfRectangles(value)
  }

  render () {
    return <div>
       <div><canvas className="Canvas" ref={(c => { this.canvas = c })} {...this.props}/></div>
       <Hinput onChange={(number => this.setNumberOfRectangles(number))} min={3} max = {50} start={10} step={1}></Hinput>
      </div>
  }
}

export default IntegralGraphREACT
