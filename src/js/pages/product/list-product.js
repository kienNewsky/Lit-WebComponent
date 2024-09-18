/* eslint-disable class-methods-use-this */
import { LitElement, html } from 'lit';
import { asyncFetch } from '../../core/hook.js';

export class ListProduct extends LitElement {
  static properties = {
    rawData: { type: Array },
    comlumns: { type: Array },
    catId: { type: String },
    catName: { type: String },
    urlData: { type: String },
    keyConnected: { type: Boolean },
    loading: { type: Boolean },
  };

  constructor() {
    super();
    this.loading = false;
    this.rawData = [];
    this.columns = [
      { field: 'STT', header: 'STT', sort: false },
      { field: 'nameStr', header: 'Ten san pham', sort: true },
      { field: 'id', header: 'Tuoi', sort: true },
    ];
    this.keyConnected = false;
    // this.catId = 'EF70AFFD-1D65-4E12-B3E1-0103372A175E';
  }

  connectedCallback() {
    super.connectedCallback();
    this.urlData = `/product-service/product/sql/select/cat-id/${this.catId}`;
    this.loadProduct();
    this.keyConnected = true;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.keyConnected = false;
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('catId')) {
      this.urlData = `/product-service/product/sql/select/cat-id/${this.catId}`;
      this.loadProduct();
    }
  }

  async loadProduct() {
    try {
      this.loading = true;
      const response = await asyncFetch(
        'GET',
        window.sqlHost,
        this.urlData,
        window.token,
        window.username,
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.text();

      if (data) {
        this.rawData = [...JSON.parse(data)];
        this.loading = false;
      } else {
        this.rawData = [];
        this.loading = false;
      }
    } catch (e) {
      console.log(e);
    }
  }

  colClicked(event) {
    // console.log('click on column ò lít product ', event);
    this.dispatchEvent(
      new CustomEvent('edit-product', {
        bubbles: true,
        composed: true,
        detail: event,
      }),
    );
  }

  render() {
    return this.loading
      ? html`<p>Loading</p>`
      : html`
          <newsky-table
            id="myTable"
            table-title=${this.catName}
            .data=${this.rawData}
            .columns=${this.columns}
            .buildRow=${(rowData, index) =>
              html` <td>${index + 1}</td>
                <td @click="${() => this.colClicked(rowData)}">
                  ${rowData.nameStr}
                </td>
                <td>${rowData.MeasName}</td>`}
          ></newsky-table>
        `;
  }
}
