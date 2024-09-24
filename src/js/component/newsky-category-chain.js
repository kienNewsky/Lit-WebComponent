import { LitElement, html } from 'lit';
import { asyncFetch } from '../core/hook.js';

export class NewskyCategoryChain extends LitElement {
  static properties = {
    catId: { type: String },
    chain: { type: Array },
    chainStr: { type: String },
  };

  connectedCallback() {
    super.connectedCallback();
    this.chain = [];
    this.chainStr = '';
    this.loadChain();
  }

  async loadChain() {
    try {
      const response = await asyncFetch(
        'GET',
        window.sqlHost,
        `/product-service/category/getCategoryChain/${this.catId}`,
        window.token,
        window.username,
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        this.chain = data;
      } else this.chain = [];
    } catch (e) {
      console.log(e);
    }
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('chain')) {
    }
  }
}
