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
    return () => {
      console.log("cleanup 0");
    }
  }, []);

  React.useEffect(() => {
    console.log("update");
    return () => {
      console.log("cleanup 1");
    }
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
