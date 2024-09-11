/* eslint-disable no-unused-vars */
import { LitElement, html, css } from 'lit';

export class ListEmployee extends LitElement {
  static properties = {
    deptId: { type: String },
  };

  render() {
    return html`
      <div>
        <h1>Employee list</h1>
        <h2>${this.deptId}</h2>
      </div>
    `;
  }
}
