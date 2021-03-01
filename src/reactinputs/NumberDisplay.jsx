import React from 'react'

class NumberDisplay extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      number: props.number
    }
  }

  render () {
    return <p>{this.state.number.toFixed(2)}</p>
  }
}

export default NumberDisplay
