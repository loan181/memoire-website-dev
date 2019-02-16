
class ProgressBar {
    constructor(id) {
        this.elem = document.getElementById(id);
        this.resetValue() ;
        this.draw();
    }

    resetValue() {
        this._value = null;
    }

    get textForBar() {
        if (this._value === null) {
            return "?";
        }
        else {
            return this.value.toFixed(2) + "%";
        }
    }

    get styleWidth() {
        if (this._value === null) {
            return "100%";
        }
        else {
            return this.value+"%";
        }
    }

    set value(newVal) {
        this._value = newVal;
        this.refreshDrawWidth();
    }

    get value() {
        return this._value;
    }

    get probgressBar() {
        return this.elem.firstElementChild.firstElementChild
    }

    get barClass() {
        if (this.value === null) {
            return "progress-bar"
        }
        if (this.value >= 99.9) {
            return "progress-bar progress-bar-striped progress-bar-animated bg-success";
        } else if (this.value >= 49.9) {
            return "progress-bar progress-bar-striped progress-bar-animated bg-warning";
        } else {
            return "progress-bar progress-bar-striped progress-bar-animated bg-danger";
        }
    }

    refreshDrawWidth() {
        this.probgressBar.style.width = this.styleWidth;
        this.probgressBar.textContent = this.textForBar;
        this.probgressBar.className = this.barClass;
    }

    draw() {
        let html="";

        html += `
        <div class="progress" style="height: 32px;">
            <div class="${this.barClass}" role="progressbar" style="width: ${this.styleWidth};" aria-valuenow="${this._value}" aria-valuemin="0" aria-valuemax="100">${this.textForBar}</div>
        </div>
        `;

        this.elem.innerHTML = html;
    }
}