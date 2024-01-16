import React from "./core/React.js";

// const App = React.createEl("div", { id: "app" }, "hello", "mini-react");
function Counter() {
  return <div>count</div>;
}
const App = (
  <div>
    mini-react
    <Counter />
  </div>
);

export default App;
