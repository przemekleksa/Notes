class Button extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isSecondary = false;
    this.label = "";
  }

  static get observedAttributes() {
    return ["secondary", "label"];
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
      });
  }

  loadTemplate(templateFile) {
    fetch(templateFile)
      .then((response) => response.text())
      .then((html) => {
        this.shadowRoot.querySelectorAll("button").forEach((el) => el.remove());
        this.shadowRoot.innerHTML += html;
        this.updateLabel();
      });
  }

  updateLabel() {
    const labelElement = this.shadowRoot.querySelector(".label");
    labelElement && (labelElement.textContent = this.label);
  }
}

customElements.define("custom-button", Button);
