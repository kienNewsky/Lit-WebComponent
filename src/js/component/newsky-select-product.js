/* eslint-disable wc/require-listener-teardown */
/* eslint-disable class-methods-use-this */
/* eslint-disable lit-a11y/click-events-have-key-events */
import { LitElement, html, css } from 'lit';
import { asyncFetch } from '../core/hook.js';

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
    query: {type: String}
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
      if (catdata) this.productData = catdata.map(item => ( {id: item.id, name: item.nameStr} ));

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

  willUpdate(changedProperties) {
    if (changedProperties.has("productData")) {
      const ele = this.shadowRoot.querySelector("newsky-autocomplete");
      ele.suggestions = [...this.productData];
    }
  }

  firstUpdated() {
    if (this.defaultValue) {
      this.fetchFirstCall()
    }
  }
}

window.customElements.define("newsky-select-product", SelectProduct)
