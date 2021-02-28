import React from 'react'

import { DerivativesGraph } from './graphs/derivatives-graph.js'
import { Hinput } from './reactinputs/Hinput'

class DerivateGraphREACT extends React.Component {
  componentDidMount () {
    this.derivativesGraph = new DerivativesGraph(this.canvas)
  }

  setH (value) {
    this.derivativesGraph.setH(value)
  }

  render () {
    return <div>
       <div><canvas className="Canvas" ref={(c => { this.canvas = c })} {...this.props}/></div>
       <Hinput onChange={(number => this.setH(number))}></Hinput>
      </div>
  }
}

export default DerivateGraphREACT
