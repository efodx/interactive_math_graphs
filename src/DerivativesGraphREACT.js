import React from 'react'

import { DerivativesGraph } from './graphs/derivatives-graph'
import { Hinput as ValueRangeInput } from './reactinputs/Hinput'

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
       <ValueRangeInput onChange={(number => this.setH(number))}></ValueRangeInput>
      </div>
  }
}

export default DerivateGraphREACT
