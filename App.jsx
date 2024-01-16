import React from "./core/React.js";

// const App = React.createEl("div", { id: "app" }, "hello", "mini-react");
function Counter() {
  return <div>count</div>;
}
function CounterContainer() {
  return <Counter></Counter>;
}

function App() {
  return (
    <div>
      mini-react
      <Counter />
    </div>
  );
}

// const App = (
//   <div>
//     mini-react
//     <Counter />
//   </div>
// );

export default App;
