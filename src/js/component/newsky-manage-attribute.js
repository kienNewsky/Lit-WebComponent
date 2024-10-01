/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import { LitElement, html, css } from 'lit';
import { asyncFetch } from '../core/hook.js';

export class NewskyManageAttribute extends LitElement {
  static properties = {
    attrLoad: { type: Array },
    attrNew: { type: Array },
    attrDel: { type: Array },
    attrShow: { type: Array },
    productId: { type: String, attribute: 'product-id' },
    allAttr: { type: Array },
  };

  static styles = css`
    .hidden {
      display: none !important;
    }
  `;

  constructor() {
    super();
    this.attrLoad = []; /** [{Id: xxxx, productRelationId: yyyy}] */
    this.attrDel = [];
    this.attrNew = [];
    this.allAttr = [];
    this.attrShow = [];
  }

  connectedCallback() {
    super.connectedCallback();
    // console.log('product id in connected call back ', this.productId);

    if (this.productId) this.loadProductAttribute();
    this.loadAllAttribute();
  }

  firstUpdated() {
    const dropdown = this.shadowRoot.querySelector('.w3-dropdown-hover');
    if (dropdown) {
      dropdown.addEventListener('mouseenter', () => {
        const dropdownContent = this.shadowRoot.querySelector(
          '.w3-dropdown-content',
        );
        if (dropdownContent) {
          // console.log("Cos chay chuot")
          dropdownContent.classList.remove('hidden'); // Show dropdown on hover
        }
      });
    }
  }

  async loadProductAttribute() {
    try {
      const response = await asyncFetch(
        'GET',
        window.sqlHost,
        `/product-service/ProductAttribute/getProductAttribute/${this.productId}`,
        window.token,
        window.username,
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.text();

      if (data) {
        this.attrLoad = JSON.parse(data).map(item => ({
          Id: item.Id,
          productRellationId: item.productRellationId,
          status: 'recorded',
          action: 'none',
        }));
      } else this.attrLoad = [];
    } catch (e) {
      console.log(e);
    }
  }

  async loadAllAttribute() {
    try {
      const response = await asyncFetch(
        'GET',
        window.sqlHost,
        '/product-service/ProductAttribute',
        window.token,
        window.username,
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        this.allAttr = [...data];
      } else this.allAttr = [];
    } catch (e) {
      console.log(e);
    }
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('productId') && this.productId) {
      console.log(
        `/product-service/ProductAttribute/getProductAttribute/${this.productId}`,
      );

      this.loadProductAttribute();
    }

    if (
      changedProperties.has('attrLoad') ||
      changedProperties.has('attrNew') ||
      changedProperties.has('attrDel')
    ) {
      const xx = [...this.attrLoad, ...this.attrNew];
      // console.log('xx: ', xx);

      this.attrShow = xx.filter(
        item =>
          !this.attrDel.some(
            delItem => delItem.Id.toLowerCase() === item.Id.toLowerCase(),
          ),
      );

      // console.log('attr Show: ', this.attrShow);
    }
  }

  addAttribute(event) {
    // eslint-disable-next-line no-console
    // console.log('attribute in tree view clicked: ', event);
    try {
      // add new attribute
      if (
        this.attrDel.filter(
          item => item.Id.toLowerCase() === event.detail.data.id.toLowerCase(),
        ).length > 0
      ) {
        this.attrDel = this.attrDel.filter(
          e => e.Id.toLowerCase() !== event.detail.data.id.toLowerCase(),
        );
        return;
      }
      const yy = [...this.attrLoad, ...this.attrNew].filter(
        item => item.Id.toLowerCase() === event.detail.data.id.toLowerCase(),
      );
      if (yy.length > 0) {
        alert(`${event.detail.data.attName} đã được thêm vào từ trước`);
        return;
      }
      this.attrNew = [
        ...this.attrNew,
        {
          Id: event.detail.data.id,
          productRellationId: null,
          status: 'new attribute',
          action: 'add',
          attName: event.detail.data.attName,
        },
      ];

      const xx = this.shadowRoot.querySelector('.w3-dropdown-content');
      xx.classList.add('hidden');
    } catch (error) {
      console.log(error);
    }
  }

  delAttribute(event) {
    this.attrDel = [...this.attrDel, event.detail];
  }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
      <div class="w3-dropdown-hover">
        Các thuộc tính của sản phẩm
        <div
          class="w3-dropdown-content w3-card-4"
          style="width:500px;  max-height: 80vh; overflow-y: auto;"
        >
          <div class="w3-container">
            <newsky-treeview
              .rawData=${this.allAttr}
              @node-clicked=${this.addAttribute}
              cat-name="attName"
            ></newsky-treeview>
          </div>
        </div>
      </div>
      <show-list-attribute
        .listAttr=${this.attrShow}
        @delete-attribute=${this.delAttribute}
      >
      </show-list-attribute>
    `;
  }
}
