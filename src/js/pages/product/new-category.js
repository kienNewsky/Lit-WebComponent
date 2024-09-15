/* eslint-disable no-nested-ternary */
/* eslint-disable no-return-assign */
import { LitElement, html } from 'lit';
import { asyncFetch } from '../../core/hook.js';

/**
 * customElements.define('new-category', NewCategory)
 */

export class NewCategory extends LitElement {
  static properties = {
    parentId: { type: String, attribute: 'parent-id' },
    parentName: { type: String },
    catName: { type: String },
    tagExtend: { type: String },

    isChildOf: { type: String },
    isRoot: { type: Boolean },
  };

  constructor() {
    super();
    this.catName = '';
    this.tagExtend = '';

    this.isChildOf = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this.isChildOf = this.parentId;
    this.isRoot = !this.parentId;
  }

  async saveCategory(event) {
    event.preventDefault();
    try {
      const response = await asyncFetch(
        'POST',
        window.sqlHost,
        `/product-service/category`,
        window.token,
        window.username,
        {
          catName: this.catName,
          tagExtend: this.tagExtend,
          isChildOf: this.isRoot
            ? null
            : this.isChildOf
              ? this.isChildOf
              : null,
        },
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();

      if (data) {
        this.dispatchEvent(
          new CustomEvent('addnew-category', {
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
          catName: this.catName,
          tagExtend: this.tagExtend,
          isChildOf: this.isChildOf,
        },
      }),
    );
  }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
      <div class="w3-row">
        <span class="w3-xxlarge w3-text-indigo">Thêm một category</span>
      </div>
      <div class="w3-row">
        <span class="w3-xlarge w3-text-indigo"
          >là cấp dưới của: ${this.parentName}
        </span>
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <label>Category name</label>
        <input
          class="w3-input"
          type="text"
          .value=${this.catName}
          @input=${e => (this.catName = e.target.value)}
        />
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <label>Tài khoản hạch toán</label>
        <input
          ?disabled=${!this.isRoot}
          class="w3-input"
          type="text"
          .value=${this.tagExtend}
          @input=${e => (this.tagExtend = e.target.value)}
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
        <label>Chuyển thành category chính</label>
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <button
          class="w3-button w3-teal w3-round-xlarge"
          @click=${this.saveCategory}
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
