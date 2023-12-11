export function scrollToElement(element, margin = 20) {
  const dims = element.getBoundingClientRect();
  setTimeout(
    () =>
      window.scroll({
        top: dims.top + window.scrollY - margin,
        left: window.scrollX,
        behavior: "smooth",
      }),
    250
  );
}
