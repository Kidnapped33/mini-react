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
      children: children.map((child) =>
        typeof child === "string" ? createTextNode(child) : child
      ),
    },
  };
}

// const textEl = createTextNode("mini-react");
const el = createEl("div", { id: "app" }, "hello", 'mini-react');

// const textNode = document.createTextNode("");
// textNode.nodeValue = textEl.props.nodeValue;

// const dom = document.createElement(el.type);
// dom.id = el.props.id;
// dom.appendChild(textNode);

// const root = document.getElementById("root");
// root.appendChild(dom);

const render = (el, root) => {
  const dom =
    el.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(el.type);

  Object.keys(el.props).forEach((key) => {
    key !== "children" && (dom[key] = el.props[key]);
  });

  el.props.children.forEach((child) => {
    render(child, dom);
  });

  root.appendChild(dom);
};

render(el, document.getElementById("root"));
