// const dom = document.createElement("div");
// dom.id = "app";
// const root = document.getElementById("root");
// root.appendChild(dom);

// const textNode = document.createTextNode("");
// textNode.nodeValue = "mini-react";
// dom.appendChild(textNode);

const textEl = {
  type: "TEXT_ELEMENT",
  props: {
    nodeValue: "mini-react",
    children: [],
  },
};

const el = {
  type: "div",
  props: {
    id: "app",
    children: [textEl],
  },
};

const dom = document.createElement(el.type);
dom.id = el.props.id;
const root = document.getElementById("root");
root.appendChild(dom);

const textNode = document.createTextNode(textEl.type);
textNode.nodeValue = textEl.props.nodeValue;
dom.appendChild(textNode);
