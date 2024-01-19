import React from "./core/React.js";

// const App = React.createEl("div", { id: "app" }, "hello", "mini-react");
let showBar = false;

const onShowBar = () => {
  showBar = !showBar;
  console.log("showBar");
  React.update();
};

// function Foo() {
//   return <div>foo</div>;
// }

// function Bar() {
//   return (
//     <div>
//       <div> Bar</div>
//       <span>children</span>
//     </div>
//   );
// }
function Counter() {
  const Foo = (
    <div>
     Foo
      <div>children</div>
      <div>children</div>
      <div>children</div>
    </div>
  );
  const Bar = <div>Bar</div>;

  return (
    <div>
      <div>
        <span>{showBar && Bar }</span>
        <button onClick={onShowBar}>showBar</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      mini-react
      <Counter />
    </div>
  );
}

export default App;
