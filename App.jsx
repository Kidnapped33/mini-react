import React from "./core/React.js";

// const App = React.createEl("div", { id: "app" }, "hello", "mini-react");
function Counter({name}) {
    return <div>count {name}</div>;
}
function App() {
  return (
    <div>
      mini-react
      <Counter name={123}/>
      <Counter name={456}/>
      <Counter name={789}/>
    </div>
  );
}

export default App;
