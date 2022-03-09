class Poll {
    constructor(root, title) {
        this.root = root;
        this.selected = sessionStorage.getItem("poll-selected");
        this.endpoint = "http://localhost:3000/poll";

        this.root.insertAdjacentHTML("afterbegin", `
            <div class="poll__title">${ title }</div>
        `);

        this._refresh();
    }

    async _refresh() {
        const response = await fetch(this.endpoint);
        const data = await response.json();

        this.root.querySelectorAll(".poll__option").forEach(option => {
            option.remove();
        });

        for (const option of data) {
            const template = document.createElement("template");
            const fragment = template.content;

            template.innerHTML = `
                <div class="poll__option ${ this.selected == option.label ? "poll__option--selected": "" }">
                    <div class="poll__option-fill"></div>
                    <div class="poll__option-info">
                        <span class="poll__label">${ option.label }</span>
                        <span class="poll__percentage">${ option.percentage }%</span>
                    </div>
                </div>
            `;

            if (!this.selected) {
                fragment.querySelector(".poll__option").addEventListener("click", () => {
                    fetch(this.endpoint, {
                        method: "post",
                        body: `add=${ option.label }`,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }).then(() => {
                        this.selected = option.label;

                        sessionStorage.setItem("poll-selected", option.label);

                        this._refresh();
                    })
                });
            }

            fragment.querySelector(".poll__option-fill").style.width = `${ option.percentage }%`;

            this.root.appendChild(fragment);
        }
    }
}

const p = new Poll(
    document.querySelector(".poll"),
    "Which do you prefer?"
);
