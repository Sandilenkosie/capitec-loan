export const openLoanDialog = (event, options = {}) => {
  if (event?.preventDefault) {
    event.preventDefault();
  }

  if (typeof window === "undefined") return;

  const { scrollToHowItWorks = true } = options;

  if (scrollToHowItWorks) {
    const section = document.querySelector("#how-it-works");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  window.__openLoanDialogRequested = true;
  window.dispatchEvent(new Event("open-loan-dialog"));
};
