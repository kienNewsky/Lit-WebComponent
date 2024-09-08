/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable eqeqeq */
/* eslint-disable wc/require-listener-teardown */
/* eslint-disable class-methods-use-this */
/* eslint-disable lit-a11y/click-events-have-key-events */
import { LitElement, html, css } from 'lit';

class AutocompleteComponent extends LitElement {
  static properties = {
    suggestions: { type: Array },
    filteredSuggestions: { type: Array },
    inputValue: { type: String },
    showSuggestions: { type: Boolean },
    highlightedIndex: { type: Number },
    maxSuggestions: { type: Number },
    col1: { type: String, attribute: 'col1' },
    col2: { type: String, attribute: 'col2' },
    defaultValue: { type: String, attribute: 'default-value' },
  };

  constructor() {
    super();
    this.suggestions = [];
    if (this.suggestions) {
      this.filteredSuggestions = this.suggestions;
    } else {
      this.filteredSuggestions = [];
    }
    this.inputValue = '';
    this.showSuggestions = false;
    this.highlightedIndex = -1;
    this.maxSuggestions = 1500; // Default to show 5 suggestions
    if (!this.col1) {
      this.col1 = 'id';
    }
    if (!this.col2) {
      this.col2 = 'name';
    }
  }

  findDefaultItem() {
    const xx = this.filteredSuggestions.findIndex(
      item =>
        item[this.col1].toString().toLowerCase() ==
        this.defaultValue.toLowerCase(),
    );
    console.log(xx);
    if (xx > 0) {
      const yy = this.filteredSuggestions.at(xx);
      this.inputValue = yy[this.col2];
      this.highlightedIndex = xx;
    } else {
      this.inputValue = '';
    }
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('suggestions')) {
      this.inputValue = '';
      this.filteredSuggestions = [...this.suggestions];

      this.findDefaultItem();

      // console.log(this.filteredSuggestions);
      this.showSuggestions = false;
      // this.highlightedIndex = -1;
    }

    if (changedProperties.has('defaultValue')) {
      if (this.filteredSuggestions.length > 0) this.findDefaultItem();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
    super.disconnectedCallback();
  }

  handleInsideClick(event) {
    // Prevent click events inside the component from propagating to the document level
    event.stopPropagation();
  }

  handleClickOutside() {
    this.showSuggestions = false;
  }

  filterSuggestions(event) {
    const query = event.target.value;
    // console.log("query ", query);
    this.inputValue = query;

    if (query.length > 0) {
      if (query.endsWith('++')) {
        if (query.slice(0, -2).length > 2) {
          this.dispatchEvent(
            new CustomEvent('launch-query', { detail: query.slice(0, -2) }),
          );
        } else {
          alert('Chỉ tìm kiếm tối thiểu 3 ký tự');
        }
        return;
      }
      if (query == '**') {
        this.dispatchEvent(new CustomEvent('launch-refresh', { detail: '**' }));
        return;
      }
      this.filteredSuggestions = this.suggestions.filter(
        suggestion =>
          suggestion &&
          suggestion[this.col2].toLowerCase().includes(query.toLowerCase()),
      );
      // .slice(0, this.maxSuggestions);  // Limit the number of suggestions
      this.showSuggestions = true;
      this.highlightedIndex = -1; // Reset highlight when filtering
    } else {
      this.filteredSuggestions = [...this.suggestions];
      this.showSuggestions = true;
    }
  }

  handleKeydown(event) {
    switch (event.key) {
      case 'ArrowDown':
        if (this.highlightedIndex < this.filteredSuggestions.length - 1) {
          this.highlightedIndex += 1;
          this.updateComplete.then(() => {
            // Scroll the highlighted item into view
            const highlightedElement =
              this.shadowRoot.querySelector('.highlighted');
            if (highlightedElement) {
              highlightedElement.scrollIntoView({ block: 'nearest' });
            }
          });
        }
        break;
      case 'ArrowUp':
        if (this.highlightedIndex > 0) {
          this.highlightedIndex -= 1;
          this.updateComplete.then(() => {
            // Scroll the highlighted item into view
            const highlightedElement =
              this.shadowRoot.querySelector('.highlighted');
            if (highlightedElement) {
              highlightedElement.scrollIntoView({ block: 'nearest' });
            }
          });
        }
        break;
      case 'Enter':
        if (this.highlightedIndex >= 0) {
          this.selectSuggestion(
            this.filteredSuggestions[this.highlightedIndex],
          );
        }
        break;
      case 'Escape':
        this.showSuggestions = false;
        this.highlightedIndex = -1;
        break;
      default:
        break;
    }
  }

  toggleSuggestions() {
    this.showSuggestions = !this.showSuggestions;
  }

  selectSuggestion(suggestion) {
    this.inputValue = suggestion[this.col2];
    this.showSuggestions = false;
    // this.filteredSuggestions = [];
    this.highlightedIndex = this.filteredSuggestions.findIndex(
      item => item[this.col1] == suggestion[this.col1],
    );
    this.dispatchEvent(
      new CustomEvent('selection-changed', { detail: suggestion }),
    );
  }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
      />

      <div class="autocomplete" @click="${this.handleInsideClick}">
        <div class="input-wrapper">
          <input
            class="w3-input"
            type="text"
            .value="${this.inputValue}"
            @input="${this.filterSuggestions}"
            @keydown="${this.handleKeydown}"
            @click="${() => this.toggleSuggestions()}"
            placeholder="Start typing..."
            data-ignore-outside-click
          />
          <span
            class="icon"
            @click="${() => this.toggleSuggestions()}"
            data-ignore-outside-click
          >
            <i class="fa fa-caret-down"></i>
          </span>
        </div>
        ${this.showSuggestions && this.filteredSuggestions.length > 0
          ? html`
              <div class="suggestions w3-card w3-white">
                ${this.filteredSuggestions.map(
                  (suggestion, index) => html`
                    <div
                      class="suggestion-item w3-padding ${this
                        .highlightedIndex === index
                        ? 'highlighted'
                        : ''}"
                      @click="${() => this.selectSuggestion(suggestion)}"
                    >
                      ${suggestion[this.col2]}
                    </div>
                  `,
                )}
              </div>
            `
          : ''}
      </div>
    `;
  }

  static styles = css`
    .autocomplete {
      position: relative;
      display: inline-block;
      width: 100%;
    }

    .suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 1000;
      max-height: 200px;
      overflow-y: auto;
    }

    .suggestion-item {
      padding: 8px 16px;
    }

    .suggestion-item.highlighted {
      background-color: #e0e0e0;
    }

    .suggestion-item:hover {
      background-color: #e0e0e0;
      cursor: pointer;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-wrapper input {
      width: 100%;
      padding-right: 30px; /* Make room for the icon */
    }

    .icon {
      position: absolute;
      right: 10px;
      cursor: pointer; /* Allow the user to click the icon */
    }
  `;
}

customElements.define('newsky-autocomplete', AutocompleteComponent);
