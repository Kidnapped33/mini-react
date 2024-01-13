// const textEl = {
//   type: "TEXT_ELEMENT",
//   props: {
//     nodeValue: "mini-react",
//     children: [],
//   },
// };

function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

const textEl = createTextNode("mini-react");

// const el = {
//   type: "div",
//   props: {
//     id: "app",
//     children: [textEl],
//   },
// };

function createEl(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}

const el = createEl("div", { id: "app" }, createTextNode("mini-react"));

// const dom = document.createElement("div");
// dom.id = "app";
// const root = document.getElementById("root");
// root.appendChild(dom);

// const textNode = document.createTextNode("");
// textNode.nodeValue = "mini-react";
// dom.appendChild(textNode);

const dom = document.createElement(el.type);
dom.id = el.props.id;
const root = document.getElementById("root");
root.appendChild(dom);

const textNode = document.createTextNode(textEl.type);
textNode.nodeValue = textEl.props.nodeValue;
dom.appendChild(textNode);
