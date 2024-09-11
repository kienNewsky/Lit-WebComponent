/* eslint-disable no-return-assign */
import { LitElement, html } from 'lit';
import { asyncFetch } from '../../core/hook.js';

/**
 * customElements.define('edit-department', EditDepartment)
 */

export class EditDepartment extends LitElement {
  static properties = {
    deptId: { type: String, attribute: 'dept-id' },
    deptName: { type: String },
    isActive: { type: Boolean },
    isChildOf: { type: String },
    keyRender: { type: Number },
  };

  constructor() {
    super();
    this.deptName = '';
    this.isActive = true;
    this.isChildOf = '';
    this.keyRender = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.keyRender === 0) {
      this.loadDepartmentDetail();
      this.keyRender = 1;
    }
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('deptId') && this.keyRender > 0)
      this.loadDepartmentDetail();
  }

  async loadDepartmentDetail() {
    try {
      const response = await asyncFetch(
        'GET',
        window.sqlHost,
        `/employee-service/department/${this.deptId}`,
        window.token,
        window.username,
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        this.deptName = data.deptName;
        this.isActive = data.isActive;
        this.isChildOf = data.isChildOf;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async saveDepartment(event) {
    event.preventDefault();
    try {
      const response = await asyncFetch(
        'PUT',
        window.sqlHost,
        `/employee-service/department/${this.deptId}`,
        window.token,
        window.username,
        {
          deptName: this.deptName,
          isActive: this.isActive,
          isChildOf: this.isChildOf,
        },
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        this.dispatchEvent(
          new CustomEvent('save-department', {
            bubbles: true,
            composed: true,
            detail: data,
          }),
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  async deleteDepartment(event) {
    event.preventDefault();
    // Nhớ chèn dòng kiểm tra xem phòng ban này có được phép xóa không rồi mới xóa
    try {
      const response = await asyncFetch(
        'DELETE',
        window.sqlHost,
        `/employee-service/department/${this.deptId}`,
        window.token,
        window.username,
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        this.dispatchEvent(
          new CustomEvent('delete-department', {
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

      <div class="w3-row" style="padding-top: 10px">
        <span class="w3-xxlarge w3-text-indigo">Sửa một phòng ban</span>
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
          @click=${this.saveDepartment}
        >
          Save
        </button>
        <button
          class="w3-button w3-orange w3-round-xlarge"
          @click=${this.deleteDepartment}
        >
          Delete
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
