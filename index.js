document.addEventListener("DOMContentLoaded", function () {
  // Accordion functionality
  const accordionTriggers = document.querySelectorAll(".accordion-trigger");

  accordionTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", !isExpanded);

      const accordionItem = trigger.closest(".accordion-item");
      const panel = document.getElementById(
        trigger.getAttribute("aria-controls")
      );

      if (!isExpanded) {
        accordionItem.classList.add("active");
      } else {
        accordionItem.classList.remove("active");
      }
    });

    // Handle keyboard navigation
    trigger.addEventListener("keydown", (e) => {
      const targetTrigger = e.target;
      const accordionContainer = targetTrigger.closest(".accordion-section");
      const triggers = [
        ...accordionContainer.querySelectorAll(".accordion-trigger"),
      ];
      const currentIndex = triggers.indexOf(targetTrigger);

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (currentIndex > 0) {
            triggers[currentIndex - 1].focus();
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (currentIndex < triggers.length - 1) {
            triggers[currentIndex + 1].focus();
          }
          break;
        case "Home":
          e.preventDefault();
          triggers[0].focus();
          break;
        case "End":
          e.preventDefault();
          triggers[triggers.length - 1].focus();
          break;
      }
    });
  });

  const scrtSpot = document.getElementById("acc3-panel-content-4");
  if (scrtSpot) {
    const scrtButton = document.createElement("button");
    scrtButton.className = "sr-only";
    scrtButton.tabIndex = 0;
    scrtButton.setAttribute("role", "alert");
    scrtButton.setAttribute("aria-live", "assertive");
    scrtButton.innerHTML = "<strong>Spongebob</strong>";

    const randomId = Math.random().toString(36).substring(2);
    scrtButton.id = `btn-${randomId}`;

    scrtSpot.appendChild(scrtButton);
  }

  // Disabled button functionality removed
  // Mobile menu functionality
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector("#main-navigation");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", !isExpanded);
      mainNav.classList.toggle("active");

      // Trap focus within menu when open
      if (!isExpanded) {
        trapFocus(mainNav);
      }
    });

    // Close menu on escape key
    document.addEventListener("keydown", function (e) {
      if (
        e.key === "Escape" &&
        menuToggle.getAttribute("aria-expanded") === "true"
      ) {
        menuToggle.setAttribute("aria-expanded", "false");
        mainNav.classList.remove("active");
        menuToggle.focus();
      }
    });
  }

  // Focus trap functionality
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];

    element.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    });

    firstFocusableElement.focus();
  }
});
