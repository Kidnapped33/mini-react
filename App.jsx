import React from "./core/React.js";

// const App = React.createEl("div", { id: "app" }, "hello", "mini-react");

function Foo() {
  const [count, setCount] = React.useState(33);
  const [bar, setBar] = React.useState("bar");
  const onClick = () => {
    setCount((c) => c + 1);
    setBar("bar1sdrsfs");
  };

  React.useEffect(() => {
    console.log("init");
  }, []);

  React.useEffect(() => {
    console.log("update");
  }, [count]);
  
  
  return (
    <div>
      <h1>foo</h1>
      {count}
      <div>{bar}</div>
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
