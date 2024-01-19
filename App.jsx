import React from "./core/React.js";

// const App = React.createEl("div", { id: "app" }, "hello", "mini-react");

let countFoo = 1;
function Foo() {
  const [count, setCount] = React.useState(33);
  const onClick = () => {
    setCount((c) => c + 1);
  };
  return (
    <div>
      <h1>foo</h1>
      {count}
      <button onClick={onClick}>click</button>
    </div>
  );
}

function App() {

  return (
    <div>
      mini-react
      <Foo />
    </div>
  );
}

export default App;
