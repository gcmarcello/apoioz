function isScrollable(element) {
  const overflowY = window.getComputedStyle(element).overflowY;
  return overflowY === "scroll" || overflowY === "auto";
}

function getScrollableParent(element) {
  while (element && element !== document.body) {
    if (isScrollable(element)) {
      return element;
    }
    element = element.parentElement;
  }
  return window;
}

export function scrollToElement(element, margin = 20) {
  const dims = element.getBoundingClientRect();
  const scrollableParent = getScrollableParent(element);

  if (scrollableParent !== window) {
    // Scroll within the container
    const containerDims = scrollableParent.getBoundingClientRect();
    const scrollPosition =
      dims.top - containerDims.top + scrollableParent.scrollTop - margin;
    setTimeout(() => {
      scrollableParent.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }, 250);
  } else {
    // Scroll the window
    setTimeout(() => {
      window.scroll({
        top: dims.top + window.scrollY - margin,
        left: window.scrollX,
        behavior: "smooth",
      });
    }, 250);
  }
}
