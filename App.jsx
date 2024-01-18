import React from "./core/React.js";

// const App = React.createEl("div", { id: "app" }, "hello", "mini-react");
let count = 33;
function Counter({ num }) {
  function add() {
    console.log("clickclick");
    // count++;
  }
  return (
    <div>
      count {num}
      <div>
        {count}
        <button onClick={add}>+1</button>
      </div>
    </div>
  );
}
function App() {
  return (
    <div>
      mini-react
      <Counter num={33} />
    </div>
  );
}

export default App;
