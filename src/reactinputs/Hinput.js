import React from 'react'
import './Hinput.css'
import RangeSlider from './RangeSlider'
import NumberDisplay from './NumberDisplay'

class Hinput extends React.Component {
  setH (value) {
    this.numberDisplay.setState({ number: value })
    this.props.onChange(Number(value))
    this.rangeSlider.setState({ value: value })
  }

  render () {
    return <div>
        <div className="cell">
            <RangeSlider ref={(c => { this.rangeSlider = c })}min={this.props.min} max={this.props.max} start={this.props.start} step={this.props.step} onChange={(value => { this.setH(value) })}></RangeSlider>
            <NumberDisplay ref={(c => { this.numberDisplay = c })} number={this.props.start}></NumberDisplay></div>
            </div>
  }
}
export { Hinput }

Hinput.defaultProps = {
  min: 0.01,
  max: 2,
  start: 1,
  step: 0.01
}
