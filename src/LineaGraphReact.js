import React from 'react'

import { LineGraph } from './graphs/line-graph.js'
import { Hinput } from './reactinputs/Hinput'

class LineGraphREACT extends React.Component {
  componentDidMount () {
    this.LineGraph = new LineGraph(this.canvas)
  }

  setN (value) {
    this.LineGraph.setN(value)
  }

  setK (value) {
    this.LineGraph.setK(value)
  }

  render () {
    return <div>
       <div><canvas className="Canvas" ref={(c => { this.canvas = c })} {...this.props}/></div>
       <Hinput onChange={(number => this.setN(number))}></Hinput>
       <Hinput onChange={(number => this.setK(number))}></Hinput>
      </div>
  }
}

export default LineGraphREACT
