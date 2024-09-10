/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-nested-ternary */
/**
  customElements.define('dept-detail', DeptDetail);
 */
import { LitElement, html, css } from 'lit';
import { choose } from 'lit/directives/choose.js';
// import { choose } from '../../core/lit-all.min.js';

export class DeptDetail extends LitElement {
  static properties = {
    mode: { type: String, attribute: 'mode' },
    deptId: { type: String, attribute: 'dept-id' },
  };

  // constructor() {
  //   super();
  //   this.isActive = true;
  //   this.deptName = 'temporary for test';
  //   this.isRoot = false;
  // }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />

      ${choose(this.mode, [
        ['', () => html`<div></div>`],
        [
          'edit',
          () =>
            html`<edit-department .deptId=${this.deptId}></edit-department>`,
        ],
        [
          'add',
          () =>
            html`<new-department .parentId=${this.deptId}></new-department>`,
        ],
        [
          'showproduct',
          () => html`<list-employee .deptId=${this.deptId}></list-employee>`,
        ],
      ])}
    `;
  }
}
