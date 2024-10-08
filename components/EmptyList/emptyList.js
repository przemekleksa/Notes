class EmptyList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    fetch("components/EmptyList/styles.css")
      .then((response) => response.text())
      .then((css) => {
        const style = document.createElement("style");
        style.textContent = css;
        this.shadowRoot.appendChild(style);
      });

    fetch("components/EmptyList/template.html")
      .then((response) => response.text())
      .then((html) => {
        this.shadowRoot.innerHTML += html;

        const button = this.shadowRoot.querySelector("custom-button");
        if (button) {
          button.addEventListener("click", () => this.replaceWithNewNote());
        }
      });
  }

  replaceWithNewNote() {
    const newNoteComponent = document.createElement("add-new-note");
    this.replaceWith(newNoteComponent);
  }
}

customElements.define("empty-list", EmptyList);
