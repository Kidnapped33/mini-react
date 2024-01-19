import React from "./core/React.js";

// const App = React.createEl("div", { id: "app" }, "hello", "mini-react");
let count = 33;
let flag = false;
function Counter() {
  function add() {
    count++;
    flag = !flag;
    React.update()
  }

  const d = <div>123</div>;
  // const p = <p>456</p>;
  function P() {
    return <p>456</p>
  }
  const p = <P />;

  return (
    <div>
      <div>
        {count}
        <button onClick={add}>+1</button>
        <span>{flag ? d : p}</span>
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
