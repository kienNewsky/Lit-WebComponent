/* eslint-disable no-param-reassign */
import { LitElement, html } from 'lit';

class NewskyTable extends LitElement {
  static properties = {
    data: { type: Array },
    filteredData: { type: Array },
    currentPage: { type: Number },
    pageSize: { type: Number },
    sortOrder: { type: String },
    sortColumn: { type: String },
    tableTitle: { type: String, attribute: "table-title" },
    // renderHeader: { type: Function }, // Add renderHeader as a property
    headerTemplate: { type: Object},
    headerAttr: {type: String, attribute: "header-attr"}
  };

  constructor() {
    super();
    this.data = [];
    this.filteredData = [];
    this.currentPage = 0;
    this.pageSize = 10;
    this.sortOrder = 'asc';
    this.sortColumn = '';
    this.start = 0;
    this.end = 10;
    this.pageData = [];
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('data')) {
      this.filteredData = [...this.data]; // Copy data into filteredData
    }

    if (changedProperties.has("currentPage") || changedProperties.has("pageSize") || changedProperties.has("filteredData")) {
      this.start = this.currentPage * this.pageSize;
      this.end = this.start + this.pageSize;
      this.pageData = this.filteredData.slice(this.start, this.end);
    }

  }

  render() {

    return html`
      <link href='https://www.w3schools.com/w3css/4/w3.css' rel='stylesheet'>
      <div>
        <div class="w3-cell-row">
          <div class="w3-cell">
            <span class="w3-xlarge">${this.tableTitle}</span>
          </div>
          <div class="w3-cell">
            <input class="w3-input" type="text" placeholder="Search..." @input="${this.filterData}">
          </div>
        </div>

        <table class="w3-table w3-hoverable">
          <thead>
            <tr>

            ${this.renderHeader()}
            </tr>
          </thead>
          <tbody>
            ${this.renderRow()}
          </tbody>
        </table>
        <div class="w3-bar">
          <button class="w3-button w3-bar-item w3-right" @click="${() => this.changePage(1)}" ?disabled="${this.end >= this.filteredData.length}">Next</button>
          <span class="w3-bar-item w3-right">Page ${this.currentPage + 1} of ${Math.ceil(this.filteredData.length / this.pageSize)}</span>
          <button class="w3-button w3-bar-item w3-right" @click="${() => this.changePage(-1)}" ?disabled="${this.currentPage === 0}">Previous</button>
        </div>
      </div>
    `;
  }

 renderHeader() {
    return Object.keys(this.data[0] || {}).map(column => html`<th @click="${() => this.sortTable(column)}">${column}</th>`)
  }

  renderRow() {
    return this.pageData.map(item => html`
      <tr @click="${() => this.rowClicked(item)}">
        ${Object.values(item).map(value => html`
          <td class="w3-border">${value}</td>
        `)}
      </tr>
    `);
  }

  filterData(event) {
    const xquery = event.target.value.toLowerCase();
    if (xquery.endsWith("++")) {
      const query = xquery.slice(0, -2)
      this.filteredData = this.data.filter(item =>
        Object.values(item).some(value =>
          value.toString().toLowerCase().includes(query)
        )
      );
      event.target.value = query
      this.currentPage = 0;
    } else if (xquery.length === 0) {
      this.filteredData = [...this.data]
    }
  }

  changePage(direction) {
    this.currentPage += direction;
    this.requestUpdate();
  }

  sortTable(column) {

    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortColumn = column;
    const xx = this.filteredData.sort((a, b) => {
      if (a[column] < b[column]) return this.sortOrder === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    this.filteredData = [... xx]
    // this.requestUpdate();
  }

  rowClicked(item) {
    const event = new CustomEvent('row-click', {
      detail: item,
    });
    this.dispatchEvent(event);
  }
}

customElements.define('newsky-table', NewskyTable);