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

const App = createEl("div", { id: "app" }, "hello", "mini-react");

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

const ReactDOM = {
  createRoot(container) {
    return { render(app) {
      render(app, container);
    } };
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(App);


