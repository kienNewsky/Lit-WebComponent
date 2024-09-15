/* eslint-disable no-return-assign */
import { LitElement, html } from 'lit';
import { asyncFetch } from '../../core/hook.js';

/**
 * customElements.define('edit-category', EditCategory)
 */

export class EditCategory extends LitElement {
  static properties = {
    catId: { type: String, attribute: 'dept-id' },
    catName: { type: String },
    tagExtend: { type: String },
    isChildOf: { type: String },
    keyRender: { type: Number },
  };

  constructor() {
    super();
    this.catName = '';
    this.tagExtend = '';
    this.isChildOf = '';
    this.keyRender = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.keyRender === 0) {
      this.loadCategoryDetail();
      this.keyRender = 1;
    }
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('catId') && this.keyRender > 0)
      this.loadCategoryDetail();
  }

  async loadCategoryDetail() {
    try {
      const response = await asyncFetch(
        'GET',
        window.sqlHost,
        `/product-service/category/${this.catId}`,
        window.token,
        window.username,
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        console.log('load category ', data);

        this.catName = data.catName;
        this.tagExtend = data.tagExtend;
        this.isChildOf = data.isChildOf;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async saveCategory(event) {
    event.preventDefault();
    console.log('data before saving ', {
      catName: this.catName,
      tagExtend: this.tagExtend,
      isChildOf: this.isChildOf,
    });

    try {
      const response = await asyncFetch(
        'PUT',
        window.sqlHost,
        `/product-service/category/${this.catId}`,
        window.token,
        window.username,
        {
          catName: this.catName,
          tagExtend: this.tagExtend,
          isChildOf: this.isChildOf,
        },
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        this.dispatchEvent(
          new CustomEvent('save-category', {
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

  async deleteCategory(event) {
    event.preventDefault();
    // Nhớ chèn dòng kiểm tra xem phòng ban này có được phép xóa không rồi mới xóa
    try {
      const response = await asyncFetch(
        'DELETE',
        window.sqlHost,
        `/product-service/category/${this.catId}`,
        window.token,
        window.username,
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        this.dispatchEvent(
          new CustomEvent('delete-category', {
            bubbles: true,
            composed: true,
            detail: {
              id: this.catId,
              catName: this.catName,
              tagExtend: this.tagExtend,
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
          id: this.catId,
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

      <div class="w3-row" style="padding-top: 10px">
        <span class="w3-xxlarge w3-text-indigo">Sửa một category</span>
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <label>Caategory name</label>
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
          ?disabled=${this.isRoot}
          class="w3-input"
          type="text"
          .value=${this.tagExtend}
          @input=${e => (this.tagExtend = e.target.value)}
        />
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <button
          class="w3-button w3-teal w3-round-xlarge"
          @click=${this.saveCategory}
        >
          Save
        </button>
        <button
          class="w3-button w3-orange w3-round-xlarge"
          @click=${this.deleteCategory}
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
