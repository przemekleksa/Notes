class Button extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});

        fetch("components/Button/styles.css")
        .then((response) => response.text())
        .then((css) => {
          const style = document.createElement("style");
          style.textContent = css;
          this.shadowRoot.appendChild(style);
        });
  
      fetch("components/Button/template.html")
        .then((response) => response.text())
        .then((html) => {
          this.shadowRoot.innerHTML += html;
        });
    }
}

customElements.define('custom-button', Button)