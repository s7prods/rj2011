(function () {

    function getInfoBoxHTML(bordercolor, backg, default_title) {
        return `
        <style>
        .main {
            border: 2px solid var(--bordercolor);
            background: var(--background);
            border-radius: 10px;

            --bordercolor: ${bordercolor};
            --background: ${backg};

            padding: 10px;
        }
        .main .caption {
            margin-bottom: 5px;
        }
        .main .caption * {
            display: inline-block;
        }
        </style>

        <div class=main pseudo="main">
            <div class=caption><slot name="icon"></slot><b><slot name="title">${default_title}</slot></b></div>

            <div class=content>
                <slot></slot>
            </div>
        </div>
        `;
    }


    customElements.define('r-info-box', class extends HTMLElement {
        constructor() {
            super();

            this._shadowRoot_ = this.attachShadow({ mode: 'open' });
            this._shadowRoot_.innerHTML = getInfoBoxHTML('#80deea', '#e0f7fa', 'Information');
        }
    });
    customElements.define('r-warn-box', class extends HTMLElement {
        constructor() {
            super();

            this._shadowRoot_ = this.attachShadow({ mode: 'open' });
            this._shadowRoot_.innerHTML = getInfoBoxHTML('#ffd54f', '#fffde7', 'Warning');

        }
    });
    customElements.define('r-error-box', class extends HTMLElement {
        constructor() {
            super();

            this._shadowRoot_ = this.attachShadow({ mode: 'open' });
            this._shadowRoot_.innerHTML = getInfoBoxHTML('#ff4f4f', '#fff2f2', 'Error');

        }
    });

    customElements.define('rj-icon', class extends HTMLElement {
        constructor() {
            super();

            this._shadowRoot_ = this.attachShadow({ mode: 'open' });
            this._shadowRoot_.innerHTML = `<span style="font-family:monospace;transform:rotate(270deg);display:inline-block;text-indent:0">RJ</span>`;
        }
    })

}());

if (window.dependencies) dependencies.done('r-cu-el');

