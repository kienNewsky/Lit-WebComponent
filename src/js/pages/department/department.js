import { LitElement, html, css } from "lit";
import './dept-detail.js'

class Department extends LitElement {
    static properties = {
        mode: { type: String },
        deptId: { type: String },
    }

    constructor() {
        super();
        this.mode = 'add';
        this.deptId = 'abccdef'
    }

    render() {
        return html`
            <dept-detail .mode=${this.mode} .deptId=${this.deptId}></dept-id>
        `
    }
}

customElements.define('newsky-department', Department)