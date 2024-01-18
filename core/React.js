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
      children: children.map((child) => {
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
      }),
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

  root = nextUnitOfWork;
};

let root = null;
let nextUnitOfWork = null;
function workloop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && root) {
    commitRoot();
  }
  requestIdleCallback(workloop);
}

function commitRoot() {
  commitWork(root.child);
  root = null;
}

function commitWork(fiber) {
  if (!fiber) return;

  let fiberParent = fiber.parent;
  while (!fiberParent.dom) fiberParent = fiberParent.parent;
  if (fiber.dom) fiberParent.dom.append(fiber.dom);

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if(key !== "children" ){
      if(key.startsWith('on')){
        const eventType = key.slice(2).toLowerCase()
        dom.addEventListener('click', props[key]);
      }
      
      (dom[key] = props[key]);
    } 
  });
}

//树转链表
function initChildren(fiber, children) {
  let prevChild = null;
  children.forEach((child, index) => {
    let newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      sibling: null,
      parent: fiber,
      dom: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}

function performUnitOfWork(fiber) {
  let isFunctionComponent = typeof fiber.type === "function";
  if (isFunctionComponent) {
  }
  if (!isFunctionComponent) {
    if (!fiber.dom) {
      const dom = (fiber.dom = createDom(fiber.type));

      // fiber.parent.dom.append(dom);

      updateProps(dom, fiber.props);
    }
  }
  const children = isFunctionComponent
    ? [fiber.type(fiber.props)]
    : fiber.props.children;
  initChildren(fiber, children);
  //执行完 a 返回 child,没有 child 就返回 sibling，没有就返回叔叔 parent.sibling
  if (fiber.child) return fiber.child;
  if (fiber.sibling) return fiber.sibling;

  let nextFiber = fiber
  while(nextFiber){
    if(nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
  // return fiber.parent?.sibling;
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

/**
 * 可能会有卡顿的问题，可以后面一次性提交
 * commitWork
 * commitRoot
 *
 * 支持 function component
 */
