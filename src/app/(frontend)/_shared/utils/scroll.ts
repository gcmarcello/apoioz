export function scrollToElement(element, margin = 20) {
  const dims = element.getBoundingClientRect();
  window.scroll({
    top: dims.top + window.scrollY - margin,
    left: window.scrollX,
    behavior: "smooth",
  });
}
