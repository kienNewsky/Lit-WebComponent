/* eslint-disable class-methods-use-this */
import { LitElement, html } from 'lit';
import { asyncFetch } from '../core/hook.js';

export class NewskyManageAttribute extends LitElement {
  static properties = {
    attrLoad: { type: Array },
    attrNew: { type: Array },
    attrDel: { type: Array },
    attrShow: { type: Array },
    productId: { type: String },
  };

  constructor() {
    super();
    this.attrLoad = [];
    this.attrDel = [];
    this.attrNew = [];
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.productId) this.loadAttribute();
  }

  async loadAttribute() {
    try {
      const response = await asyncFetch(
        'GET',
        window.sqlHost,
        url,
        window.token,
        window.username,
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.text();
      if (data) {
        this.attrLoad = [...JSON.parse(data)];
      } else this.attrLoad = [];
    } catch (e) {
      console.log(e);
    }
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('productId')) {
      this.loadAttribute();
    }

    if (
      changedProperties.has('attrLoad') ||
      changedProperties.has('attrNew') ||
      changedProperties.has('attrDel')
    ) {
      const xx = [...this.attrLoad, this.attrNew];
      this.attrShow = xx.filter(
        item =>
          !this.attrDel.some(
            delItem => delItem.Id.toLowerCase() === item.Id.toLowerCase(),
          ),
      );
    }
  }

  addAttribute(event) {
    // eslint-disable-next-line no-console
    console.log('attribute in tree view clicked: ', event);
    // add new attribute
  }

  delAttribute(event) {
    console.log('delete attribute: ', event);
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
              .rawData=${this.attrShow}
              @node-clicked=${this.addAttribute}
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
