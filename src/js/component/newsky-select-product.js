/* eslint-disable wc/require-listener-teardown */
/* eslint-disable class-methods-use-this */
/* eslint-disable lit-a11y/click-events-have-key-events */
import { LitElement, html, css } from 'lit';
import { asyncFetch } from '../core/hook.js';
import "./newsky-treeview-2.js";
import "./newsky-autocomplete.js";

class SelectProduct extends LitElement {
  static properties = {
    defaultValue: {type: String, attribute: 'default-value'},
    defaultProductUrl: {type: String},
    initialUrl: {type: String},
    queryUrl: {type: String},
    categoryUrl: {type: String},
    selectedProduct: {type: Object},
    productData: {type: Array},
    category: {type: String},
    fetchType: {type: String},
    query: {type: String},
    catRaw: {type: Array},
  }

  constructor() {
    super();
    if (!this.defaultValue) this.defaultValue = '';
    if (!this.defaultValue) {
      this.defaultProductUrl = `/product-service/product/${this.defaultValue}`
      this.initialUrl = `/product-service/product/firstCall/${this.defaultValue}`
    } else {
      this.defaultProductUrl = ''
      this.initialUrl = ''
    }

    this.category = '';
    this.fetchType = 'category'
    this.query = ''
    this.productData = []
  }

  fetchDefaultProduct() {
    asyncFetch("GET", window.sqlHost, this.defaultProductUrl, window.token, window.username)
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        throw new Error(`Response status: ${response.status}`);
    })
    .then(data => {
      if (data) {
        this.selectedProduct = {id: data.id, name: data.nameStr};
        this.category = data.extraCategoryID;
      }
    })
    .catch(e => console.log(e))
  }

  async fetchFirstCall() {
    try {
      const response = await asyncFetch("GET", window.sqlHost, this.initialUrl, window.token, window.username)
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const catdata = await response.json();
      // console.log(catdata);
      // const ele = this.shadowRoot.querySelector("newsky-autocomplete");
      // console.log(ele);
      // ele.suggestions = [...this.productData];
      if (catdata) this.productData = catdata.map(item => ( {id: item.id, name: item.nameStr} ));
      // console.log(this.productData);
    } catch (e) {
      console.log(e)
    }
  }

  async fetchByCategory() {
    try {
      const response = await asyncFetch("GET", window.sqlHost, `/product-service/product/byCategoryID/${this.category}`, window.token, window.username)
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      if (data) this.productData = data.map(item => ( {id: item.id, name: item.nameStr} ));

    } catch (e) {
      console.log(e)
    }
  }

  async fetchAllCat() {
    try {
      const response = await asyncFetch("GET", window.sqlHost, '/product-service/category', window.token, window.username);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      if (data) this.catRaw = [...data];
      // console.log(this.catRaw)

    } catch (error) {
      console.log(error)
    }
  }

  willUpdate(changedProperties) {
    if (changedProperties.has("productData")) {
      // const ele = this.shadowRoot.querySelector("newsky-autocomplete");
      // console.log(ele);
      // ele.suggestions = [...this.productData];
    }

    if (changedProperties.has("defaultValue")) {
      this.defaultProductUrl = `/product-service/product/${this.defaultValue}`
      this.initialUrl = `/product-service/product/firstCall/${this.defaultValue}`
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.defaultValue) {
      this.defaultProductUrl = `/product-service/product/${this.defaultValue}`
      this.initialUrl = `/product-service/product/firstCall/${this.defaultValue}`
      this.fetchFirstCall();
      this.fetchAllCat();
    }
  }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
      <div class="w3-dropdown-hover">Sản phẩm
        <div class="w3-dropdown-content w3-card-4" style="width:500px; height: 700px; overflow-y: auto;">

          <div class="w3-container">
            <lit-tree-view .rawData=${this.catRaw}></lit-tree-view>
          </div>
        </div>
      </div>
      <newsky-autocomplete .suggestions=${this.productData} .defaultValue=${this.defaultValue}></newsky-autocomplete>
    `
  }
}

window.customElements.define("newsky-select-product", SelectProduct)
