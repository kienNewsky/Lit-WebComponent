/* eslint-disable wc/require-listener-teardown */
/* eslint-disable class-methods-use-this */
/* eslint-disable lit-a11y/click-events-have-key-events */
import { LitElement, html, css } from 'lit';
import { asyncFetch } from '../core/hook.js';
import './newsky-treeview-2.js';
import './newsky-autocomplete.js';

class SelectProduct extends LitElement {
  static properties = {
    defaultValue: { type: String, attribute: 'default-value' },
    defaultProductUrl: { type: String },
    initialUrl: { type: String },
    queryUrl: { type: String },
    categoryUrl: { type: String },
    selectedProduct: { type: Object },
    productData: { type: Array },
    categoryId: { type: String },
    categoryName: { type: String },
    fetchType: { type: String },
    query: { type: String },
    catRaw: { type: Array },
  };

  static styles = css`
    .hidden {
      display: none !important;
    }
  `;

  constructor() {
    super();
    if (!this.defaultValue) this.defaultValue = '';
    if (!this.defaultValue) {
      this.defaultProductUrl = `/product-service/product/${this.defaultValue}`;
      this.initialUrl = `/product-service/product/firstCall/${this.defaultValue}`;
    } else {
      this.defaultProductUrl = '';
      this.initialUrl = '';
    }

    this.categoryId = '';
    this.fetchType = 'category';
    this.query = '';
    this.productData = [];
    this.categoryName = '';
  }

  async fetchDefaultProduct() {
    try {
      const response = await asyncFetch(
        'GET',
        window.sqlHost,
        this.defaultProductUrl,
        window.token,
        window.username,
      );
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      const data = await response.json();
      if (data) {
        this.selectedProduct = { id: data.id, name: data.nameStr };
        this.categoryId = data.extraCategoryID;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchProductList(url) {
    try {
      const response = await asyncFetch(
        'GET',
        window.sqlHost,
        url,
        window.token,
        window.username,
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      if (data)
        this.productData = data.map(item => ({
          id: item.id,
          name: item.nameStr,
        }));
    } catch (e) {
      console.log(e);
    }
  }

  async fetchAllCat() {
    try {
      const response = await asyncFetch(
        'GET',
        window.sqlHost,
        '/product-service/category',
        window.token,
        window.username,
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        this.catRaw = [...data];
        if (this.categoryId && this.categoryName.length === 0) {
          const xx = data.find(
            element =>
              element.id.toLowerCase() === this.categoryId.toLowerCase(),
          );
          this.categoryName = xx.catName;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('categoryId')) {
      if (
        this.categoryName.length === 0 &&
        this.categoryId &&
        this.catRaw.length > 0
      ) {
        const xx = this.catRaw.find(
          element => element.id.toLowerCase() === this.categoryId.toLowerCase(),
        );
        this.categoryName = xx.catName;
      }
    }

    if (changedProperties.has('defaultValue')) {
      this.defaultProductUrl = `/product-service/product/${this.defaultValue}`;
      this.initialUrl = `/product-service/product/firstCall/${this.defaultValue}`;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.defaultValue) {
      this.defaultProductUrl = `/product-service/product/${this.defaultValue}`;
      this.initialUrl = `/product-service/product/firstCall/${this.defaultValue}`;
      this.fetchDefaultProduct();
      // this.fetchFirstCall();
      this.fetchProductList(this.initialUrl);
    }
    this.fetchAllCat();
  }

  firstUpdated() {
    const dropdown = this.shadowRoot.querySelector('.w3-dropdown-hover');
    if (dropdown) {
      dropdown.addEventListener('mouseenter', () => {
        const dropdownContent = this.shadowRoot.querySelector(
          '.w3-dropdown-content',
        );
        if (dropdownContent) {
          // console.log("Cos chay chuot")
          dropdownContent.classList.remove('hidden'); // Show dropdown on hover
        }
      });
    }
  }

  async treeViewClick(event) {
    console.log(event.detail); // it worked
    try {
      this.categoryId = event.detail.data.id;
      this.fetchType = 'category';
      this.categoryName = event.detail.data.catName;

      this.fetchProductList(
        `/product-service/product/byCategoryID/${event.detail.data.id}`,
      );

      const xx = this.shadowRoot.querySelector('.w3-dropdown-content');
      xx.classList.add('hidden');
    } catch (error) {
      console.log(error);
    }
  }

  productSelected(event) {
    // console.log(event.detail);
    this.selectedProduct = { id: event.detail.id, name: event.detail.name };
    // console.log("selected product: ", this.selectedProduct);
    this.dispatchEvent(
      new CustomEvent('product-select', { detail: this.selectedProduct }),
    );
  }

  execQuery(event) {
    this.query = event.detail;
    this.fetchType = 'query';
    this.fetchProductList(`/product-service/product/byNameStr/${this.query}`);
    console.log('to query: ', event.detail);
  }

  execRefresh(event) {
    if (this.fetchType === 'category') {
      this.fetchProductList(
        `/product-service/product/byCategoryID/${this.categoryId}`,
      );
    }

    if (this.fetchType === 'query') {
      this.fetchProductList(`/product-service/product/byNameStr/${this.query}`);
    }
    console.log('To Refresh: ', event.detail);
  }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <div class="w3-dropdown-hover">
        ${this.selectedProduct?.id
          ? html`Sản phẩm <strong>thuộc nhóm ${this.categoryName}</strong>`
          : html`<span class="w3-text-red"
              >Sản phẩm <strong>thuộc nhóm ${this.categoryName}</strong></span
            >`}
        <div
          class="w3-dropdown-content w3-card-4"
          style="width:500px;  max-height: 80vh; overflow-y: auto;"
        >
          <div class="w3-container">
            <lit-tree-view
              .rawData=${this.catRaw}
              @node-clicked=${this.treeViewClick}
            ></lit-tree-view>
          </div>
        </div>
      </div>
      <newsky-autocomplete
        .suggestions=${this.productData}
        .defaultValue=${this.defaultValue}
        @selection-changed=${this.productSelected}
        @launch-query=${this.execQuery}
        @launch-refresh=${this.execRefresh}
      >
      </newsky-autocomplete>
    `;
  }
}

window.customElements.define('newsky-select-product', SelectProduct);
