import React from 'react'

import { LineGraph } from './graphs/line-graph.js'
import TextNumberInput from './reactinputs/TextNumberInput'

class LineGraphREACT extends React.Component {
  componentDidMount () {
    this.LineGraph = new LineGraph(this.canvas)
  }

  setN (value) {
    this.LineGraph.setN(value)
    this.nInput.setState({ value: value })
  }

  setK (value) {
    this.LineGraph.setK(value)
    this.kInput.setState({ value: value })
  }

  render () {
    return <div>
       <div><canvas className="Canvas" ref={(c => { this.canvas = c })} {...this.props}/></div>
       <div>
        <div>
        <table className="center">
          <thead>
          <tr><td> y = </td><td><TextNumberInput ref={c => { this.kInput = c }} value={1} onChange={(number => this.setK(number))}></TextNumberInput></td>
          <td>*x + </td><td><TextNumberInput ref={c => { this.nInput = c }} value={1} onChange={(number => this.setN(number))}></TextNumberInput></td></tr>
          </thead>
          </table>
       </div>
      </div>
      </div>
  }
}

export default LineGraphREACT
