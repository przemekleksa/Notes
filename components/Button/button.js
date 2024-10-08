class Button extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isSecondary = false;
    this.label = "";
    this.fullWidth = false;
  }

  static get observedAttributes() {
    return ["secondary", "label", "fullWidth"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "secondary") {
      this.isSecondary = newValue !== null;
      this.loadTemplateAndStyles();
    }

    if (name === "label") {
      this.label = newValue || "";
      this.updateLabel();
    }

    if (name === "fullWidth") {
      this.fullWidth = newValue !== null;
      this.updateFullWidth;
    }
  }

  connectedCallback() {
    this.loadTemplateAndStyles();
  }

  loadTemplateAndStyles() {
    const templateFile = this.isSecondary
      ? "components/Button/templateSecondary.html"
      : "components/Button/template.html";
    const stylesFile = this.isSecondary
      ? "components/Button/stylesSecondary.css"
      : "components/Button/styles.css";

    this.loadTemplate(templateFile);
    this.loadStyles(stylesFile);
  }

  loadStyles(stylesFile) {
    fetch(stylesFile)
      .then((response) => response.text())
      .then((css) => {
        const style = document.createElement("style");
        style.textContent = css;
        this.shadowRoot.querySelectorAll("style").forEach((el) => el.remove());
        this.shadowRoot.appendChild(style);
        this.updateFullWidth();
      });
  }

  loadTemplate(templateFile) {
    fetch(templateFile)
      .then((response) => response.text())
      .then((html) => {
        this.shadowRoot.querySelectorAll("button").forEach((el) => el.remove());
        this.shadowRoot.innerHTML += html;
        this.updateLabel();
        this.updateFullWidth();
      });
  }

  updateLabel() {
    const labelElement = this.shadowRoot.querySelector(".label");
    labelElement && (labelElement.textContent = this.label);
  }

  updateFullWidth() {
    const buttonElement = this.shadowRoot.querySelector("button");
    const labelElement = this.shadowRoot.querySelector(".label");

    if (buttonElement && labelElement) {
      buttonElement.style.width = this.fullWidth ? "" : "100%";
      labelElement.style.width = this.fullWidth ? "" : "100%";
    }
  }
}

customElements.define("custom-button", Button);
