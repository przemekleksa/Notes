class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        .search-container {
          position: relative;
        }

        input {
          padding: 8px 12px 8px 36px;
          font-size: 16px;
          font-weight: 400;
          color: #5B5C5E;
          background-color: #EEEFF0;
          width: 100%;
          border: 0px;
          border-radius: 12px;
          background-image: url(../assets/search.svg);
          background-repeat: no-repeat;
          background-size: 24px 24px;
          background-position: left 10px center;
          margin-bottom: 24px;
        }

        input:hover {
          background-color: #DCDEE0;
        }

        input:focus {
          background-color: #FFF;
          outline-color: #000;
        }

        .clear-button {
          position: absolute;
          right: 10px;
          top: 9px;
          transform: scale(2);
          font-weight: 200;
          cursor: pointer;
          display: none;
          background: none;
          border: none;
          font-size: 16px;
        }

        .clear-button.visible {
          display: block;
        }

        .clear-button img {
          width: 14px;
        }

      </style>
      <div class="search-container">
        <input type="text" id="search-input" placeholder="Search notes...">
        <button class="clear-button" id="clear-button">
        <img src="assets/clear.svg" alt="clear" />
        </button> 
      </div>
    `;

    this.timeoutId = null;

    this.shadowRoot
      .querySelector("#search-input")
      .addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const clearButton = this.shadowRoot.querySelector("#clear-button");
        clearButton.classList.toggle("visible", query.length > 0);

        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
          this.dispatchEvent(
            new CustomEvent("search", {
              detail: query,
              bubbles: true,
              composed: true,
            })
          );
        }, 100);
      });

    this.shadowRoot
      .querySelector("#clear-button")
      .addEventListener("click", () => {
        const inputField = this.shadowRoot.querySelector("#search-input");
        inputField.value = "";
        inputField.dispatchEvent(new Event("input"));
      });
  }
}

customElements.define("search-bar", SearchBar);
