/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-nested-ternary */
import { LitElement, html, css } from 'lit';
import { choose } from 'lit/directives/choose.js';
// import { choose } from '../../core/lit-all.min.js';

class DeptDetail extends LitElement {
  static properties = {
    mode: { type: String, attribute: 'mode' },
    deptId: { type: String, attribute: 'dept-id' },
    isActive: { type: Boolean },
    deptName: { type: String },
    isChildOf: { type: String },
    isRoot: { type: Boolean },
  };

  constructor() {
    super();
    // this.mode = '';
    // this.deptId = '';
    this.isActive = true;
    this.deptName = 'temporary for test';
    this.isRoot = false;
  }

  saveEdit(event) {
    event.preventDefault();
    console.log('Save Edit Dept running');
    // this.mode ='';
  }

  saveNew(event) {
    event.preventDefault();
    console.log('Save Edit Dept running');
    // this.mode ='';
  }

  cancelDetail(event) {
    event.preventDefault();
    console.log('Save Edit Dept running');
    // this.mode ='';
  }

  editDept() {
    return html`
      <div class="w3-row" style="padding-top: 10px">
        <span class="w3-xxlarge w3-text-indigo">Sửa một phòng ban</span>
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <label>Tên phòng ban</label>
        <input class="w3-input" type="text" .value=${this.deptName} />
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <input
          class="w3-check"
          type="checkbox"
          .checked=${this.isActive}
          @click=${() => {
            this.isActive = !this.isActive;
          }}
        />
        <label>${this.isActive ? 'Đang ' : 'Dừng '} sử dụng</label>
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <button
          class="w3-button w3-teal w3-round-xlarge"
          @click=${this.saveEdit}
        >
          Save
        </button>
        <button
          class="w3-button w3-khaki w3-round-xlarge"
          @click=${this.cancelDetail}
        >
          Cancel
        </button>
      </div>
    `;
  }

  newDept() {
    return html`
      <div class="w3-row" style="padding-top: 10px">
        <span class="w3-xxlarge w3-text-indigo">Thêm một phòng ban</span>
      </div>
      <div class="w3-row">
        <span class="w3-xlarge w3-text-indigo">là cấp dưới của: </span>
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <label>Tên phòng ban</label>
        <input class="w3-input" type="text" />
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <input
          class="w3-check"
          type="checkbox"
          .checked=${this.isRoot}
          @click=${() => {
            this.isRoot = !this.isRoot;
          }}
        />
        <label>Chuyển thành phòng ban chính</label>
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <button
          class="w3-button w3-teal w3-round-xlarge"
          @click=${this.saveNew}
        >
          Save
        </button>
        <button
          class="w3-button w3-khaki w3-round-xlarge"
          @click=${this.cancelDetail}
        >
          Cancel
        </button>
      </div>
    `;
  }

  addDept(event) {
    event.preventDefault();
    console.log('Save Edit Dept running');
    // this.mode ='';
  }

  showProduct() {}

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />

      ${choose(this.mode, [
        ['', () => html`<div></div>`],
        ['edit', () => this.editDept()],
        ['add', () => this.newDept()],
        ['showproduct', () => this.showProduct()],
      ])}
    `;
  }
}

customElements.define('dept-detail', DeptDetail);
