/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-nested-ternary */
/**
  customElements.define('cat-detail', CatDetail);
 */
import { LitElement, html, css } from 'lit';
import { choose } from 'lit/directives/choose.js';
// import { choose } from '../../core/lit-all.min.js';

export class CatDetail extends LitElement {
  static properties = {
    mode: { type: String, attribute: 'mode' },
    catId: { type: String, attribute: 'cat-id' },
    catName: { type: String },
    empId: { type: String },
  };

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />

      ${choose(this.mode, [
        ['', () => html`<div></div>`],
        [
          'edit',
          () => html`<edit-category .catId=${this.catId}></edit-category>`,
        ],
        [
          'add',
          () =>
            html`<new-category
              .parentId=${this.catId}
              .parentName=${this.catName}
            ></new-category>`,
        ],
        [
          'showproduct',
          () =>
            html`<list-product
              .catId=${this.catId}
              .catName=${this.catName}
            ></list-product>`,
        ],
        [
          'new-product',
          () =>
            html`<new-product
              .extraCategoryID=${this.catId}
              .catName=${this.catName}
            ></new-product>`,
        ],
        [
          'edit-product',
          () => html`<edit-product .productId=${this.empId}></edit-product>`,
        ],
      ])}
    `;
  }
}
