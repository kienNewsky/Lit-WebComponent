/* eslint-disable lit-a11y/click-events-have-key-events */
import { LitElement, html, css } from 'lit';
import { treeData } from './tree-data.js';

class TreeView extends LitElement {
  static properties = {
    rawData: {type: Array}
  };

  static styles = css`
    /* W3.CSS styles will be applied from the linked CSS */
    .tree-item {
      cursor: pointer;
      margin-left: 15px;
    }

    .tree-item-children {
      display: none;
      margin-left: 20px;
    }

    .tree-item-open .tree-item-children {
      display: block;
    }
  `;

  constructor() {
    super();
    // this.data = [
    //   {
    //     name: 'Root',
    //     children: [
    //       { name: 'Child 1', children: [{ name: 'Grandchild 1' }] },
    //       { name: 'Child 2', children: [] },
    //     ],
    //   },
    // ];
    this.data = this.buildTree(treeData);
  }

  // eslint-disable-next-line class-methods-use-this
  buildTree(dataTree) {
    const tree = [];
    const lookup = {};

    // Create a lookup table to store all nodes by their IDs
    dataTree.forEach(item => {
      lookup[item.id] = { ...item, children: [] };
    });

    // Build the tree structure
    dataTree.forEach(item => {
      if (item.isChildOf === null) {
        // This is a root node, add it directly to the tree
        tree.push(lookup[item.id]);
      } else {
        // This is a child, add it to the correct parent's children array
        // eslint-disable-next-line no-lonely-if
        if (lookup[item.isChildOf]) {
          lookup[item.isChildOf].children.push(lookup[item.id]);
        }
      }
    });

    return tree;
  }

  // eslint-disable-next-line class-methods-use-this
  toggleChildren(e) {
    const item = e.currentTarget.parentNode;
    item.classList.toggle('tree-item-open');
  }

  renderTree(data) {
    return data.map(
      (item) => html`
        <div class="tree-item">
          <div @click="${this.toggleChildren}" class="w3-text-teal">
            ${item.catName}
          </div>
          ${item.children && item.children.length > 0
            ? html`<div class="tree-item-children">
                ${this.renderTree(item.children)}
              </div>`
            : ''}
        </div>
      `
    );
  }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
      <div class="w3-container">
        ${this.renderTree(this.data)}
      </div>
    `;
  }
}

customElements.define('newsky-treeview', TreeView);
