/* eslint-disable no-return-assign */
import { LitElement, html } from 'lit';
import { asyncFetch } from '../../core/hook.js';

/**
 * customElements.define('new-department', EditDepartment)
 */

export class NewDepartment extends LitElement {
  static properties = {
    parentId: { type: String, attribute: 'parent-id' },
    deptName: { type: String },
    isActive: { type: Boolean },
    isChildOf: { type: String },
    isRoot: { type: Boolean },
  };

  constructor() {
    super();
    this.deptName = '';
    this.isActive = true;
    this.isChildOf = '';
    this.isRoot = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.isChildOf = this.parentId;
  }

  async saveDepartment(event) {
    event.preventDefault();
    try {
      const response = await asyncFetch(
        'POST',
        window.sqlHost,
        `/employee-service/department`,
        window.token,
        window.username,
        {
          deptName: this.deptName,
          isActive: this.isActive,
          isChildOf: this.isRoot ? null : this.isChildOf,
        },
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();

      if (data) {
        this.dispatchEvent(
          new CustomEvent('addnew-department', {
            bubbles: true,
            composed: true,
            detail: data, // { ...data, parentId: this.parentId },
          }),
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  cancelDetail(event) {
    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent('cancel-detail', {
        bubbles: true,
        composed: true,
        detail: {
          id: this.deptId,
          deptName: this.deptName,
          isActive: this.isActive,
          isChildOf: this.isChildOf,
        },
      }),
    );
  }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
      <div class="w3-row">
        <span class="w3-xxlarge w3-text-indigo">Thêm một phòng ban</span>
      </div>
      <div class="w3-row">
        <span class="w3-xlarge w3-text-indigo">là cấp dưới của: </span>
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <label>Tên phòng ban</label>
        <input
          class="w3-input"
          type="text"
          .value=${this.deptName}
          @input=${e => (this.deptName = e.target.value)}
        />
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
          @click=${this.saveDepartment}
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
}
