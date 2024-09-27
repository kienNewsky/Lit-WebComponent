import { LitElement, html } from 'lit';

export class ShowListAttribute extends LitElement {
  static properties = {
    listAttr: { type: Array },
  };

  constructor() {
    super();
    this.listAttr = [
      {
        Id: 'EE7BC314-8E75-45A9-BA77-A49141907DCE',
        attName: 'NEWSKY',
        isChildOf: 'CF1B81D3-B8F6-4D8C-8746-43BFB4EA0C80',
        oldID: 4,
        ProductScope: 'LAMINATE',
        productRelationId: 'E53B6140-C200-4120-BFBF-000004AA10DC',
      },
      {
        Id: '40926DF7-E917-431D-A943-462320710B8C',
        attName: '800',
        isChildOf: '209A5C58-E964-4394-983F-3164C6B55D4C',
        oldID: 13,
        ProductScope: 'LAMINATE',
        productRelationId: '54BD442E-0596-4D8A-930C-2160409E6952',
      },
      {
        Id: 'F6B062AE-F55F-4964-BDF1-A8871E8EAC16',
        attName: 'Trắng',
        isChildOf: 'F1371A26-88AA-4256-A7A5-B823FD534CCE',
        oldID: 17,
        ProductScope: 'LAMINATE',
        productRelationId: 'DCD29D2E-202F-44C5-947A-32920C44F105',
      },
      {
        Id: '91FF3FF5-7321-4F01-8A2E-F1F3FA9D6CA5',
        attName: 'AC3',
        isChildOf: '952E3035-7E8F-4BAE-B7F3-75CDA4C8ED3A',
        oldID: 6,
        ProductScope: 'LAMINATE',
        productRelationId: '10DACCD5-A076-4139-B18E-49A1C62B0F16',
      },
      {
        Id: 'FF4D5964-A77B-43BA-83E3-2CC7867E8D9F',
        attName: 'NEWSKY LOGO',
        isChildOf: 'CB4389A0-CA03-49AE-A466-D6C7E15999A4',
        oldID: 11,
        ProductScope: 'LAMINATE',
        productRelationId: '300F77CB-91A6-4E0A-8588-514B490B8D69',
      },
      {
        Id: '41813CAF-44E0-4436-8D24-A19F09A83209',
        attName: '12 mm',
        isChildOf: '24A706DD-FFEE-4B0C-8833-4FF1731A55B8',
        oldID: 25,
        ProductScope: 'LAMINATE',
        productRelationId: 'B1BD8622-4287-4E61-B95F-56A5DA99449C',
      },
      {
        Id: '955F7755-0368-4066-8766-C21B1C0887DF',
        attName: '6',
        isChildOf: '1BE3EB92-D423-4443-9D29-06D185B726BF',
        oldID: 241,
        ProductScope: 'LAMINATE',
        productRelationId: '6807D325-29D3-401D-A7DD-6A6DBADF9405',
      },
      {
        Id: '7E231F24-22C0-4A48-BE65-6A42C96B8FD3',
        attName: 'G403',
        isChildOf: '1DC8DEFE-BB84-4135-A093-AFA83E0DA663',
        oldID: 123,
        ProductScope: 'LAMINATE',
        productRelationId: '40C10564-E35D-4F68-BFFD-7899AAB816E8',
      },
      {
        Id: '6CE63C4E-EB1A-4A41-9131-168863379F97',
        attName: 'Nâu đỏ',
        isChildOf: 'C8953C92-1331-4A57-B994-9B8EF6C206AE',
        oldID: 238,
        ProductScope: 'LAMINATE',
        productRelationId: 'E0BF6898-F104-4B5D-9C07-A2771C314D25',
      },
    ];
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
