/* eslint-disable no-nested-ternary */
/* eslint-disable no-return-assign */
import { LitElement, html } from 'lit';
import { measCat } from '../core/hook.js';

export class NewskySelectMeasCat extends LitElement {
  static properties = {
    catId: { type: String },
    measId: { type: String },
    measName: { type: String },
  };

  constructor() {
    super();
    this.catId = '';
    this.measName = '';
    this.measId = '';
  }

  catChange(e) {
    this.catId = e.target.value;
    this.dispatchEvent(
      new CustomEvent('meas-cat-change', { detail: this.catId }),
    );
  }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
      <select class="w3-select" .value=${this.catId} @change=${this.catChange}>
        ${measCat.map(
          item =>
            html`<option
              value="${item.value}"
              ?selected=${this.catId === item.value.toString()}
            >
              ${item.name}
            </option>`,
        )}
      </select>
    `;
  }
}
