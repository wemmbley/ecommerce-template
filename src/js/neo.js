function neo(el) {
    return new Neo(el);
}

class Neo {
    el;
    options;
    typingTimer;

    onTypingCallback;

    constructor(el = null) {
        this.el = el;
    }

    on(action, callback, options = {}) {
        switch (action) {
            case 'userCancelAction': {
                this.onActionCancelled(callback, options);

                break;
            }
            case 'userTyping': {
                this.onTyping(callback, options);

                break;
            }
            default: {
                document.addEventListener(action, callback, options);
            }
        }

        return this;
    }

    select(el) {
        if(this.el !== null) {
            return this.el.querySelector(el);
        }

        return document.querySelector(el);
    }

    selectAll(el) {
        if(this.el !== null) {
            return this.el.querySelectorAll(el);
        }

        return document.querySelectorAll(el);
    }

    show() {
        if(this.el.classList.contains('d-none')) {
            this.el.classList.remove('d-none');
        }
    }

    hide() {
        if(!this.el.classList.contains('d-none')) {
            this.el.classList.add('d-none');
        }
    }

    addClass(className) {
        this.el.classList.add(className);
    }

    removeClass(className) {
        this.el.classList.remove(className);
    }

    clear() {
        this.el.value = '';
    }

    text(text) {
        this.el.innerText = text;
    }

    onActionCancelled(callback, options) {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                callback();
            }
        });

        document.addEventListener('click', (event) => {
            const target = event.target;
            const skipElements = options.skipElements;

            let isSkip = false;

            skipElements.forEach((el) => {
                if (target === el) {
                    isSkip = true;
                }
            });

            if (!this.el.contains(target) && !isSkip) {
                callback();
            }
        });
    }

    typeDone(callback) {
        let sleep = 1000;

        if(this.options.sleep !== undefined) {
            sleep = this.options.sleep;
        }

        this.el.addEventListener('input', (event) => {
            this.onTypingCallback();

            clearTimeout(this.typingTimer);

            this.typingTimer = setTimeout(callback, sleep, event);
        });
    }

    onTyping(callback, options)
    {
        this.onTypingCallback = callback;
        this.options = options;
    }

    ajax(url, method = 'GET', body, headers) {
        return fetch(url, {
            method: method,
            body: JSON.stringify(body),
            headers: headers,
        })
    }

    clone() {
        return this.el.cloneNode(this.el);
    }

    prop(attr, val) {
        this.el.setAttribute(attr, val);

        return this.el;
    }

    props(props) {
        props.forEach((prop) => {
            this.el.setAttribute(prop.name, prop.value);
        });

        return this.el;
    }

    dropChildren(children) {
        const elementsToRemove = this.el.querySelectorAll(children);

        elementsToRemove.forEach(element => {
            element.remove();
        });
    }
}