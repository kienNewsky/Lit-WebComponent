/* eslint-disable no-nested-ternary */
/* eslint-disable no-return-assign */
import { LitElement, html } from 'lit';
import { asyncFetch } from '../core/hook.js';

export class NewskySelectWarehouse extends LitElement {
  static properties = {
    catId: { type: String },
    measId: { type: String },
    measName: { type: String },
    measCat: { type: Array },
  };

  constructor() {
    super();
    this.catId = '';
    this.measName = '';
    this.measId = '';
    this.measCat = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadWarehouseData();
  }

  async loadWarehouseData() {
    try {
      const response = await asyncFetch(
        'GET',
        window.sqlHost,
        '/product-service/product/sql/select/warehouses',
        window.token,
        window.username,
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.text();
      if (data) {
        console.log(JSON.parse(data));

        this.measCat = JSON.parse(data).map(item => ({
          value: item.ID,
          name: item.nameStr,
        }));
      }
    } catch (e) {
      console.log(e);
    }
  }

  catChange(e) {
    this.catId = e.target.value;
    this.dispatchEvent(
      new CustomEvent('warehouse-change', { detail: this.catId }),
    );
  }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
      <select class="w3-select" .value=${this.catId} @change=${this.catChange}>
        ${this.measCat.map(
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
