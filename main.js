const dom = document.createElement("div");
dom.id = "app";
const root = document.getElementById("root");
root.appendChild(dom);

const textNode = document.createTextNode("");
textNode.nodeValue = "mini-react";
dom.appendChild(textNode);

// Extract the same content into a common object
// "div" and ""
// .id and .nodeValue

const el = {
  type: "div",
  props: {
    id: "app",
    children: [
      {
        type: "TEXT_ELEMENT",
        props: {
          nodeValue: "mini-react",
          children: [],
        },
      },
    ],
  },
};
