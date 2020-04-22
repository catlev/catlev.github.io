(function() {
    class Equation {
        /**
         * 
         * @param {Object[]} structure
         * @param {number} structure[].id
         * @param {string} structure[].str
         */
        constructor(structure) {
            this.structure = structure;
        }

        /**
         * Parse an equation as a string into an equation strucure.
         * 
         * @param {string} str
         * 
         * @returns {Equation}
         */
        static parse(str) {
            let structure = [];
            let lexicon = /([0-9a-zA-Z]+(?:_[0-9a-zA-Z]+)?)|(:)|(->)|(\s+)/y;
            let m;
            while (m = lexicon.exec(str)) {
                structure.push({id: tokenId(m), str: m[0]});
            }
            return new Equation(structure);
        }

        /**
         * Add to the provided HTML element so that the equation is reflected in
         * that element's contents.
         * 
         * @param {HTMLElement} root 
         */
        appendTo(root) {
            let text = document.createTextNode.bind(document);

            let procs = [
                createSymbolNode,
                text,
                () => text('→'),
                () => text(' '),
            ];

            this.structure
                .map(s => procs[s.id-1](s.str))
                .forEach(root.appendChild.bind(root));
        }
    }

    /**
     * 
     * @param {string[]} m 
     */
    function tokenId(m) {
        for (let i = 1; i < m.length; i++) {
            if (m[i] === m[0]) {
                return i;
            }
        }
    }

    /**
     * 
     * @param {string} m 
     */
    function createSymbolNode(m) {
        let [s, n] = m.split('_');
        let element = document.createElement('span');
        let symbol = document.createElement('i');
        symbol.textContent = s;
        element.appendChild(symbol);
        if (n !== '') {
            let subscript = document.createElement('sub');
            subscript.textContent = n;
            element.appendChild(subscript);
        }
        return element;
    }

    class ExampleElement extends HTMLElement {
        constructor() {
            super();

            let text = this.textContent;
            this.innerText = '';
            let root = this.attachShadow({mode: 'closed'});

            let title = document.createElement('h3');
            let content = document.createElement('pre');
    
            content.innerText = text;
            title.innerText = `Example: ${this.getAttribute('title')}`;
    
            root.appendChild(title);
            root.appendChild(content);
        }
    }

    class EquationElement extends HTMLElement {
        constructor() {
            super();

            let eqn = Equation.parse(this.textContent);
            this.innerText = '';

            let root = this.attachShadow({mode: 'closed'});
            let content = document.createElement('span');
            
            eqn.appendTo(content);

            root.appendChild(content);
        }

    }

    customElements.define('er-example', ExampleElement);
    customElements.define('er-eqn', EquationElement);

})();

