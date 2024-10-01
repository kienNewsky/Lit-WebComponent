/* eslint-disable no-console */
import { LitElement, html } from 'lit';
import { asyncFetch } from '../core/hook.js';

export class NewskyCategoryChain extends LitElement {
  static properties = {
    catId: { type: String, attribute: 'cat-id' },
    url: { type: String, attribute: 'url' },
    chain: { type: Array },
    chainStr: { type: String },
    catName: { type: String, attribute: 'cat-name' },
  };

  constructor() {
    super();
    this.chain = [];
    this.chainStr = '';
    if (!this.catName) this.catName = 'catName';
  }

  // connectedCallback() {
  //   super.connectedCallback();

  //   this.loadChain();
  // }

  async loadChain() {
    try {
      const response = await asyncFetch(
        'GET',
        window.sqlHost,
        `${this.url}/${this.catId}`,
        window.token,
        window.username,
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      // console.log(data);

      if (data) {
        this.chain = data;
      } else this.chain = [];
    } catch (e) {
      console.log(e);
    }
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('catId')) this.loadChain();
    if (changedProperties.has('chain')) {
      let str = '';
      const chainLength = this.chain.length;
      if (chainLength > 0) {
        for (let i = 0; i < chainLength; i += 1) {
          str = `${str + this.chain[i][this.catName]} >> `;
        }
      }
      if (str.length > 0) this.chainStr = str.slice(0, -3);
    }
  }

  render() {
    return html` <span>${this.chainStr}</span> `;
  }
}
