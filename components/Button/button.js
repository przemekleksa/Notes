class Button extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isSecondary = false;
    this.label = "";
    this.fullwidth = false;
    this.isTertiary = false;
  }

  static get observedAttributes() {
    return ["secondary", "label", "fullwidth", "tertiary"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "secondary") {
      this.isSecondary = newValue !== null;
      this.loadTemplateAndStyles();
    }
    if (name === "tertiary") {
      this.isTertiary = newValue !== null;
      this.loadTemplateAndStyles();
    }

    if (name === "label") {
      this.label = newValue || "";
      console.log("first");
      this.updateLabel();
    }

    if (name === "fullwidth") {
      this.fullwidth = newValue !== null;
      this.updateFullWidth();
    }
  }

  connectedCallback() {
    this.loadTemplateAndStyles();
  }

  loadTemplateAndStyles() {
    const templateFile =
      this.isSecondary || this.isTertiary
        ? "components/Button/templateSecondary.html"
        : "components/Button/template.html";

    let stylesFile;
    switch (true) {
      case this.isSecondary:
        stylesFile = "components/Button/stylesSecondary.css";
        break;
      case this.isTertiary:
        stylesFile = "components/Button/stylesTertiary.css";
        break;
      default:
        stylesFile = "components/Button/styles.css";
        break;
    }

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
      buttonElement.style.width = this.fullwidth ? "100%" : "";
      labelElement.style.width = this.fullwidth ? "100%" : "";
    }
  }
}

customElements.define("custom-button", Button);
