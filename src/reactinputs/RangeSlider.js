import React from 'react'
import './RangeSlider.css'

class RangeSlider extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.start
    }
  }

  handleChange () {
    this.props.onChange(Number(this.rangeSlider.value))
  }

  render () {
    return <input className="rangeSlider" type="range" ref={(c => { this.rangeSlider = c })} min={this.props.min} value={this.state.value} max={this.props.max} step={this.props.step} onInput={() => this.handleChange()}></input>
  }
}
export default RangeSlider
