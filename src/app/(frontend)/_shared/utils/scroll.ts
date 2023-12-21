function isScrollable(element: HTMLElement) {
  const overflowY = window.getComputedStyle(element).overflowY;
  return overflowY === "scroll" || overflowY === "auto";
}

function getScrollableParent(element: HTMLElement | null) {
  while (element && element !== document.body) {
    if (isScrollable(element)) {
      return element;
    }

    element = element.parentElement;
  }
  return window;
}

export function scrollToElement(element: HTMLElement, margin = 20) {
  const dims = element.getBoundingClientRect();
  const scrollableParent = getScrollableParent(element);

  if (scrollableParent !== window) {
    const containerDims = (scrollableParent as HTMLElement).getBoundingClientRect();
    const scrollPosition =
      dims.top - containerDims.top + (scrollableParent as HTMLElement).scrollTop - margin;
    setTimeout(() => {
      scrollableParent.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }, 250);
  } else {
    setTimeout(() => {
      window.scroll({
        top: dims.top + window.scrollY - margin,
        left: window.scrollX,
        behavior: "smooth",
      });
    }, 250);
  }
}
