class InputField extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Note title";

    const style = document.createElement("style");
    style.textContent = `
      input {
        width: 100%;
        padding: 8px 12px;
        margin-bottom: 10px;
        background: #EEEFF0;
        border: 0px;
        font-size: 16px;
        font-weight: 400;
        border-radius: 12px;
        padding-left: 16px;
        padding-right: 16px;
      }

      input:hover {
        background: #DCDEE0;
      }

      input:focus{
        background: #FFF;
        outline-color: #000;

      }
    `;
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(input);
  }
  get value() {
    return this.shadowRoot.querySelector("input").value;
  }

  set value(val) {
    this.shadowRoot.querySelector("input").value = val;
  }
}

customElements.define("note-input-field", InputField);
