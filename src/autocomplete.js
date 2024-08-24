import { LitElement, html, css } from "lit";

class CountySelector extends LitElement {
  static styles = css`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      box-sizing: border-box;
    }

    input[type="text"] {
      width: 100%;
      height: 40px;
      box-sizing: border-box;
      padding: 8px;
    }

    .suggestions {
      border: 1px solid #ccc;
      border-top: none;
      list-style-type: none;
      padding: 0;
      margin-top: 0;
      max-height: 200px;
      overflow-y: auto;
    }

    .suggestions div {
      padding: 10px;
      cursor: pointer;
    }

    .suggestions div:hover {
      background-color: #f0f0f0;
    }
  `;

  static properties = {
    selectedCounty: {},
    counties: { type: Array },
    filteredCounties: { type: Array, state: true }
  };

  constructor() {
    super();
    this.selectedCounty = '';
    this.counties = [];
    this.filteredCounties = [];
    this.fetchCounties();
  }

  async fetchCounties() {
    try {
      const response = await fetch('https://data.jws.app/v1/locations/wisconsin-counties.json');
      if (response.ok) {
        const data = await response.json();
        this.counties = data.counties.map(item => item.name);
      } else {
        console.error('Failed to fetch counties:', response.status);
      }
    } catch (error) {
      console.error('Error fetching counties:', error);
    }
  }

  selectCounty(countyName) {
    this.selectedCounty = countyName;
    this.filteredCounties = [];
  }

  updated(changedProperties) {
    if (changedProperties.has('selectedCounty')) {
      this.filteredCounties = this.selectedCounty.trim() ? this.counties.filter(county =>
        county.toLowerCase().includes(this.selectedCounty.toLowerCase()) &&
        county.toLowerCase() !== this.selectedCounty.toLowerCase()
      ) : [];
    }
  }

  render() {
    return html`
      <div class="container">
        <input type="text" placeholder="Wisconsin County" .value="${this.selectedCounty}" @input="${e => this.selectedCounty = e.target.value}" autocomplete="off"/>
        <div class="suggestions" ?hidden="${!this.filteredCounties.length}">
          ${this.filteredCounties.map(suggestion => html`
            <div @click="${() => this.selectCounty(suggestion)}">
              ${suggestion}
            </div>
          `)}
        </div>
      </div>
    `;
  }
}

customElements.define('county-selector', CountySelector);
