class TextArea extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Your note";

    const style = document.createElement("style");
    style.textContent = ` 
        textarea {
            width: 100%;
            height: 210px;
            padding: 8px 12px;
            background: #EEEFF0;
            border: 0px;
            border-radius: 12px;
            font-family: "Inter", sans-serif;
            font-size: 16px;
            font-weight: 400;
            padding-left: 16px;
            padding-right: 16px;
            letter-spacing: -0.3px;
        }

        textarea:hover {
            background: #DCDEE0;
        }
        
        textarea:focus {
            background: white;
            outline-color: #000;
        }
        `;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(textarea);

    textarea.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        this.dispatchEvent(
          new CustomEvent("save-note", { bubbles: true, composed: true })
        );
      }
    });
  }

  get value() {
    return this.shadowRoot.querySelector("textarea").value;
  }

  set value(val) {
    this.shadowRoot.querySelector("textarea").value = val;
  }
}

customElements.define("note-textarea-field", TextArea);
