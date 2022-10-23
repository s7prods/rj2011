customElements.define('r-info-box', class extends HTMLElement {
    constructor() {
        super();

        this._shadowRoot_ = this.attachShadow({ mode: 'open' });
        this._shadowRoot_.innerHTML = `
        <style>
        .main {
            border: 2px solid var(--bordercolor);
            background: var(--background);
            border-radius: 3px;

            --bordercolor: #80deea;
            --background: #e0f7fa;
        }
        </style>

        <div class=main pseudo="main">
            <slot name="icon"></slot>
            <slot></slot>
        </div>
        `;
    }
});
customElements.define('r-warn-box', class extends HTMLElement {
    constructor() {
        super();

        this._shadowRoot_ = this.attachShadow({ mode: 'open' });
        this._shadowRoot_.innerHTML = `
        <style>
        .main {
            border: 2px solid var(--bordercolor);
            background: var(--background);
            border-radius: 3px;

            --bordercolor: #ffd54f;
            --background: #fffde7;
        }
        </style>

        <div class=main pseudo="main">
            <slot name="icon"></slot>
            <slot></slot>
        </div>
        `;
    }
});
