import { LitElement, html } from 'lit';

export class ShowListAttribute extends LitElement {
  static properties = {
    listAttr: { type: Array },
  };

  constructor() {
    super();
    this.listAttr = [];
  }

  attrClick(e, relId) {
    // e.preventDefault();
    console.log('delete attribute: ', relId);

    this.dispatchEvent(new CustomEvent('delete-attribute', { detail: relId }));
  }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
      />

      <table class="w3-table w3-bordered w3-hoverable">
        <thead>
          <tr>
            <th>STT</th>
            <th>Thuộc tính</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${this.listAttr.map(
            (item, idx) => html`
              <tr>
                <td>${idx + 1}</td>
                <td>
                  <newsky-category-chain
                    cat-id=${item.Id}
                    url="/product-service/ProductAttribute/getAttributeChain"
                    cat-name="attName"
                  ></newsky-category-chain>
                </td>
                <td>
                  <a
                    href="#"
                    class="w3-text-red"
                    @click=${e => this.attrClick(e, item.productRelationId)}
                  >
                    <i class="fa fa-solid fa-trash"></i>
                  </a>
                </td>
              </tr>
            `,
          )}
        </tbody>
      </table>
    `;
  }
}
