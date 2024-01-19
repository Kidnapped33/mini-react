import React from "./core/React.js";

// const App = React.createEl("div", { id: "app" }, "hello", "mini-react");
let showBar = false;

const update = React.update()
const onShowBar = () => {
  showBar = !showBar;
  console.log("showBar");
  update()
};

function Foo() {
  console.log("Foo return");

  let count = 0;
  const update = React.update()
  const onClick = () => {
    count++;
   update();
  }
  return (
    <div>
      foo{count}
      <button onClick={onClick}>click</button>
    </div>
  );
}

function Bar() {
  console.log("bar return");

  let count = 0;
  const update = React.update()
  const onClick = () => {
    count++;
    update();
  }
  return (
    <div>
      <div> Bar</div>
      <span>{count}</span>
      <button onClick={onClick}> click</button>
    </div>
  );
  }
function App() {
  console.log("App return");

  let count = 0;
  const onClick = () => {
    console.log("App return");
    count++;
    React.update();
  }
  return (
    <div>
      mini-react{count}
      <button onClick={onClick}> click</button>
      <Foo/>
      <Bar/>
    </div>
  );
}

export default App;
