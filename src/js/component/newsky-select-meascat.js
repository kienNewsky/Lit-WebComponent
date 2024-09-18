/* eslint-disable no-return-assign */
import { LitElement, html } from 'lit';

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
        <option value="1" selected>Diện tích</option>
        <option value="2">Chiều dài</option>
        <option value="3">Khối lượng</option>
        <option value="4">Đơn lẻ</option>
        <option value="5">Thể tích</option>
      </select>
    `;
  }
}
