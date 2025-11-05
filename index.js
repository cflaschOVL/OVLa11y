document.addEventListener("DOMContentLoaded", function () {
  // Skip link functionality
  const skipLinks = document.querySelectorAll(".skip-link");

  skipLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      let focusElement = null;

      if (targetId === "main-navigation") {
        const navElement = document.getElementById("main-navigation");
        const menuToggle = document.querySelector(".menu-toggle");

        // If navigation is hidden (mobile menu closed), open it first
        if (
          menuToggle &&
          menuToggle.getAttribute("aria-expanded") === "false"
        ) {
          // Open the mobile menu
          menuToggle.setAttribute("aria-expanded", "true");
          navElement.classList.add("active");
          menuToggle.setAttribute("aria-label", "Close navigation menu");

          // Wait for visibility transition to complete before focusing
          setTimeout(() => {
            const firstLink = navElement.querySelector("a[href]");
            if (firstLink) {
              firstLink.focus();
            }
          }, 50); // Small delay to ensure visibility: visible is applied
          return; // Exit early since we're handling focus in setTimeout
        } else {
          // Desktop: focus first link
          const firstLink = navElement.querySelector("a[href]");
          focusElement = firstLink || navElement;
        }
      } else if (targetId === "main-content") {
        // Focus the first visible headline in main content
        focusElement = document.getElementById("main-heading");
      } else if (targetId === "footer") {
        // Focus the Quick Links heading
        focusElement = document.getElementById("quick-links");
      }

      if (focusElement) {
        focusElement.focus();
        // Scroll into view if needed
        focusElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

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
        panel.setAttribute("aria-hidden", "false");
      } else {
        accordionItem.classList.remove("active");
        panel.setAttribute("aria-hidden", "true");
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

  // Disabled button functionality removed
  // Mobile menu functionality
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector("#main-navigation");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", !isExpanded);
      mainNav.classList.toggle("active");

      // Update aria-label based on state
      if (!isExpanded) {
        menuToggle.setAttribute("aria-label", "Close navigation menu");
        trapFocus(mainNav, menuToggle);
      } else {
        menuToggle.setAttribute("aria-label", "Open navigation menu");
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
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.focus();
      }
    });
  }

  const scrtSpot = document.getElementById("acc3-panel-content-4");
  if (scrtSpot) {
    const scrtButton = document.createElement("button");
    scrtButton.className = "sr-only";
    scrtButton.tabIndex = 0;
    scrtButton.ariaLabel = "Das Codewort ist: Spongebob";
    scrtButton.innerHTML = "<strong>Spongebob</strong>";

    const randomId = Math.random().toString(36).substring(2);
    scrtButton.id = `btn-${randomId}`;

    scrtSpot.appendChild(scrtButton);
  }

  // Focus trap functionality
  function trapFocus(element, closeButton) {
    const focusableElements = element.querySelectorAll(
      'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0 && !closeButton) return;

    // Create array of all focusable elements including the close button
    const allFocusableElements = closeButton
      ? [closeButton, ...focusableElements]
      : [...focusableElements];

    const firstFocusableElement = allFocusableElements[0];
    const lastFocusableElement =
      allFocusableElements[allFocusableElements.length - 1];

    // Handler for focus trap
    const trapHandler = function (e) {
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
    };

    // Add listener to document for better capture
    document.addEventListener("keydown", trapHandler);

    // Focus first nav link (not the close button) when opening
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Store handler for cleanup if needed
    element.trapHandler = trapHandler;
  }
});
