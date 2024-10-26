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
      { field: 'nameStr', header: 'Tên sản phẩm', sort: true },
      { field: 'id', header: 'Đơn vị tính', sort: true },
    ];
    this.keyConnected = false;
    // this.catId = 'EF70AFFD-1D65-4E12-B3E1-0103372A175E';
    this.swapCatSucceed = this.swapCatSucceed.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.urlData = `/product-service/product/sql/select/cat-id/${this.catId}`;
    this.loadProduct();
    this.keyConnected = true;
    document.addEventListener('swap-product-category', this.swapCatSucceed);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.keyConnected = false;
    document.removeEventListener('swap-product-category', this.swapCatSucceed);
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('catId')) {
      this.urlData = `/product-service/product/sql/select/cat-id/${this.catId}`;
      this.loadProduct();
    }
  }

  swapCatSucceed(event) {
    const productId = event.detail.id;
    this.rawData = [
      ...this.rawData.filter(
        item => item.Id.toLowerCase() !== productId.toLowerCase(),
      ),
    ];
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

  newProduct(event) {
    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent('new-product', {
        bubbles: true,
        composed: true,
        detail: { catId: this.catId, catName: this.catName },
      }),
    );
  }

  render() {
    return this.loading
      ? html`<p>Loading</p>`
      : html`
          <link
            href="https://www.w3schools.com/w3css/4/w3.css"
            rel="stylesheet"
          />

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
          <div class="w3-row" style="padding-top: 10px">
            <div class="w3-col m3">
              <button
                class="w3-button w3-teal w3-round-xlarge"
                @click=${this.newProduct}
              >
                Thêm sản phẩm
              </button>
            </div>
          </div>
        `;
  }
}
