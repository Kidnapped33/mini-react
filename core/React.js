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
  wipRoot = {
    dom: container,
    props: {
      children: [el],
    },
  };

  nextUnitOfWork = wipRoot;
};

let currentRoot = null;
let wipRoot = null;
let nextUnitOfWork = null;
let deletions = [];
let wipFiber = null;
function workloop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    if (wipRoot?.sibling?.type === nextUnitOfWork?.type) {
      nextUnitOfWork = undefined;
    }
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workloop);
}

function commitRoot() {
  deletions.forEach(commitDeletion);
  deletions = [];
  commitWork(wipRoot.child);
  commitEffectHooks();
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitEffectHooks() {
  function run(fiber) {
    if (!fiber) return;

    if (!fiber.alternate) {
      //init
      fiber.effectHooks?.forEach((hook) => {
        hook.cleanup = hook.callback();
      });
    } else {
      // update
      // deps 有变化就执行
      fiber.effectHooks?.forEach((newHook, index) => {
        if ((newHook.deps, length > 0)) {
          const oldEffectHook = fiber.alternate?.effectHooks[index];
          // some
          const needUpdate = oldEffectHook?.deps.some((oldDep, i) => {
            return oldDep !== newHook.deps[i];
          });

          needUpdate && (newHook.cleanup = newHook.callback());
        }
      });
    }
    run(fiber.child);
    run(fiber.sibling);
  }
  function runCleanup(fiber) {
    if (!fiber) return;
    fiber.alternate?.effectHooks?.forEach((hook) => {
      if ((hook.deps, length > 0)) {
        hook.cleanup && hook.cleanup();
      }
    });
    runCleanup(fiber.child);
    runCleanup(fiber.sibling);
  }
  runCleanup(wipRoot);
  run(wipRoot);
}

function commitDeletion(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) fiberParent = fiberParent.parent;
    fiberParent.dom.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child);
  }
}

function commitWork(fiber) {
  if (!fiber) return;

  let fiberParent = fiber.parent;
  while (!fiberParent.dom) fiberParent = fiberParent.parent;

  if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) fiberParent.dom.append(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, nextProps, prevProps = {}) {
  // 1、old 有 new 没有 remove
  Object.keys(prevProps).forEach((key) => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  });
  // 2、old 没有 new 有 add
  // 3、old 和 new 都有 update
  Object.keys(nextProps).forEach((key) => {
    if (key !== "children") {
      if (prevProps[key] !== nextProps[key]) {
        if (key.startsWith("on")) {
          const eventType = key.slice(2).toLowerCase();
          dom.removeEventListener(eventType, prevProps[key]);
          dom.addEventListener(eventType, nextProps[key]);
        }

        dom[key] = nextProps[key];
      }
    }
  });
}

//树转链表
function reconcileChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child;
  let prevChild = null;
  children.forEach((child, index) => {
    let isSameType = oldFiber && oldFiber.type === child.type;
    let newFiber;
    if (isSameType) {
      //update
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        sibling: null,
        parent: fiber,
        dom: oldFiber.dom,
        alternate: oldFiber,
        effectTag: "update",
      };
    } else {
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          sibling: null,
          parent: fiber,
          dom: null,
          effectTag: "placement",
        };
      }

      if (oldFiber) {
        deletions.push(oldFiber);
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }

    if (newFiber) {
      prevChild = newFiber;
    }
  });
  while (oldFiber) {
    deletions.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
}

function updateFunctionComponent(fiber) {
  stateHooks = [];
  stateHookIndex = 0;
  effectHooks = [];
  wipFiber = fiber;
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    updateProps(dom, fiber.props);
  }

  const children = fiber.props.children;
  reconcileChildren(fiber, children);
}
function performUnitOfWork(fiber) {
  let isFunctionComponent = typeof fiber.type === "function";
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  //执行完 a 返回 child,没有 child 就返回 sibling，没有就返回叔叔 parent.sibling
  if (fiber.child) return fiber.child;
  if (fiber.sibling) return fiber.sibling;

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
  // return fiber.parent?.sibling;
}

requestIdleCallback(workloop);

const update = () => {
  let currentFiber = wipFiber;
  return () => {
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };
    nextUnitOfWork = wipRoot;
  };
};

let stateHooks;
let stateHookIndex;
function useState(initial) {
  let currentFiber = wipFiber;
  const oldHook = currentFiber.alternate?.stateHooks[stateHookIndex];
  const stateHook = {
    state: oldHook ? oldHook.state : initial,
    queue: oldHook ? oldHook.queue : [],
  };

  stateHook.queue.forEach((action) => {
    stateHook.state = action(stateHook.state);
  });

  stateHook.queue = [];

  stateHookIndex++;
  stateHooks.push(stateHook);

  currentFiber.stateHooks = stateHooks;
  const setState = (action) => {
    const eagerState =
      typeof action === "function" ? action(stateHook.state) : action;
    if (eagerState === stateHook.state) return;
    stateHook.queue.push(typeof action === "function" ? action : () => action);

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };

    nextUnitOfWork = wipRoot;
  };
  return [stateHook.state, setState];
}
let effectHooks;
function useEffect(callback, deps) {
  const effectHook = {
    callback,
    deps,
    cleanup: undefined,
  };
  effectHooks.push(effectHook);
  wipFiber.effectHooks = effectHooks;
}
export default {
  useState,
  useEffect,
  update,
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
