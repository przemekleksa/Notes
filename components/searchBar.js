class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <style>
                input {
                    padding: 8px 12px;
                    font-size: 16px;
                    font-weight: 400;
                    color: #5B5C5E;
                    background-color: #EEEFF0;
                    width: 100%;
                    max-width: 500px;
                    border: 0px;
                    border-radius: 12px;
                    background-image: url(../assets/search.svg);
                    background-repeat: no-repeat;
                    text-indent: 26px;
                    background-size: 24px 24px;
                    background-position: left 10px center;
                    margin-bottom: 24px;
                }

                    input:hover {
                        background-color: #DCDEE0;
                    }

                    input:focus{
                        background-color: #FFF;
                        outline-color: #000;
                    }
            </style>
            <input type="text" id="search-input" placeholder="Search notes...">
        `;

    this.shadowRoot
      .querySelector("#search-input")
      .addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        this.dispatchEvent(
          new CustomEvent("search", {
            detail: query,
            bubbles: true,
            composed: true,
          })
        );
      });
  }
}

customElements.define("search-bar", SearchBar);
