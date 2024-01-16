function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
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

const render = (el, container) => {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [el],
    },
  };
  // const dom =
  //   el.type === "TEXT_ELEMENT"
  //     ? document.createTextNode("")
  //     : document.createElement(el.type);

  // Object.keys(el.props).forEach((key) => {
  //   key !== "children" && (dom[key] = el.props[key]);
  // });

  // el.props.children.forEach((child) => {
  //   render(child, dom);
  // });

  // root.appendChild(dom);
};

let nextUnitOfWork = null;
function workloop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workloop);
}

function performUnitOfWork(work) {

  //没有 dom 就创建 dom
  if(!work.dom){
  const dom = (work.dom =
    work.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(work.type));

  // work.parent.dom.append(dom);

  //* set props
  Object.keys(work.props).forEach((key) => {
    key !== "children" && (dom[key] = work.props[key]);
  });

  work.parent.dom.append(dom);

}
  //树转链表
  const children = work.props.children;
  let prevChild = null;
  children.forEach((child, index) => {
    let newChild = {
      type: child.type,
      props: child.props,
      child: null,
      sibling: null,
      parent: work,
      dom: null,
    };
    if (index === 0) {
      work.child = newChild;
    } else {
      prevChild.sibling = newChild;
    }
    prevChild = newChild;
  });
  //执行完 a 返回 child,没有 child 就返回 sibling，没有就返回叔叔 parent.sibling
  if (work.child) return work.child;
  if (work.sibling) return work.sibling;
  return work.parent?.sibling;
}

requestIdleCallback(workloop);

export default {
  render,
  createElement,
};

/**
 * 任务调度器;
 * 一个 work 和 执行work
 * work 在 render 里面赋值
 * 执行 work 时
 * 创建 dom
 * set props
 * 树转链表
 * 遍历 children 绑定关系 child sibling parent
 * 执行完 a 返回 child,没有 child 就返回 sibling，没有就返回叔叔 parent.sibling
 * 创建完之后需要添加到父级容器里
 * render 和 nextUnitOfWork 匹配
 * 没有 dom 就创建 dom
 * 看看处理孩子的逻辑
 * 执行到最后一个就结束，可以理解为，没有节点就不执行了
 */

// 学到的内容
/**
 * requestIdleCallback(workloop);
 * work.timeRemaining()
 */
