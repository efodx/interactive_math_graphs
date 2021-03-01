import React, { Component } from 'react'

class TextNumberInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      value: props.value
    }
  }

  onChange () {
    this.props.onChange(Number(this.input.value))
  }

  render () {
    return (
            <input type="text" value={this.state.value} ref={(c => { this.input = c })} onInput={(() => this.onChange())}></input>
    )
  }
}

export default TextNumberInput
