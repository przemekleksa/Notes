class Note extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    fetch("components/Note/styles.css")
      .then((response) => response.text())
      .then((css) => {
        const style = document.createElement("style");
        style.textContent = css;
        this.shadowRoot.appendChild(style);
      });

    this.render();
  }

  static get observedAttributes() {
    return ["title", "content", "id", "timestamp"];
  }

  attributeChangedCallback() {
    this.render();
  }

  formatTimestamp(timestamp) {
    const date = new Date(Number(timestamp));
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = String(date.getDate()).padStart(2, "0");
    const month = months[String(date.getMonth() + 1)];
    return `${month} ${day}`;
  }

  render() {
    this.shadowRoot.innerHTML = "";
    const title = this.getAttribute("title");
    const content = this.getAttribute("content");
    const id = this.getAttribute("id");
    const timestamp = this.getAttribute("timestamp");

    const container = document.createElement("div");
    container.classList.add("note");

    const header = document.createElement("div");
    header.classList.add("header");

    const icons = document.createElement("div");
    icons.classList.add("icons");

    const editIcon = document.createElement("img");
    editIcon.src = "assets/edit.svg";
    editIcon.alt = "edit note";

    const removeIcon = document.createElement("img");
    removeIcon.src = "assets/remove.svg";
    removeIcon.alt = "remove note";

    icons.appendChild(editIcon);
    icons.appendChild(removeIcon);

    const noteTitle = document.createElement("div");
    noteTitle.textContent = title;

    header.appendChild(noteTitle);
    header.appendChild(icons);

    const noteContent = document.createElement("p");
    noteContent.textContent = content;

    const date = document.createElement("div");
    date.classList.add("date");
    date.textContent = this.formatTimestamp(timestamp);

    container.appendChild(header);
    container.appendChild(noteContent);
    container.appendChild(date);

    this.shadowRoot.appendChild(container);
  }
}

customElements.define("note-element", Note);
