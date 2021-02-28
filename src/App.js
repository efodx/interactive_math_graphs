import './App.css'
import DerivateGraphREACT from './DerivativesGraphREACT.js'
import IntegralGraphREACT from './IntegralGraphREACT.js'
import LineGraphREACT from './LineaGraphReact.js'

function App () {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Interactive Math Graphs
        </p>
      </header>
      <div className = "Graph-division">
        <p>Derivatives Graph</p>
        <DerivateGraphREACT width={1000} height={400}></DerivateGraphREACT>
      </div>
      <div className = "Graph-division">
        <p>Line Graph</p>
        <LineGraphREACT width={1000} height={400}></LineGraphREACT>
      </div>
      <div className = "Graph-division">
        <p>Integral Graph</p>
        <IntegralGraphREACT width={1000} height={400}></IntegralGraphREACT>
      </div>
      </div>
  )
}

export default App
