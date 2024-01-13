function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createEl(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}

const textEl = createTextNode("mini-react");
// const el = createEl("div", { id: "app" }, textEl);
const el = createEl("div", { id: "app" }, createTextNode("mini-react"));

const dom = document.createElement(el.type);
dom.id = el.props.id;
const root = document.getElementById("root");
root.appendChild(dom);

const textNode = document.createTextNode(textEl.type);
textNode.nodeValue = textEl.props.nodeValue;
dom.appendChild(textNode);
