/* eslint-disable no-alert */
/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable lit-a11y/click-events-have-key-events */
import { LitElement, html, css } from 'lit';

export class LitTreeView extends LitElement {
  static styles = css`
    .tree-node {
      padding: 2px;
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .tree-node.selected {
      background-color: #2196F3;
      color: white;
    }

    .tree-children {
      padding-left: 20px;
      display: none;
    }

    .tree-children.expanded {
      display: block;
    }

    .icon {
      margin-right: 5px;
      cursor: pointer;
    }

    .draggable {
      user-select: none;
    }

    .drop-target {
      border: 2px dashed #ccc;
    }

    .tree-node.highlight {
      background-color: yellow;
    }

    .tree-node.highlight.selected {
      background-color: black;
    }

    .toolbar {
      margin-bottom: 10px;
    }

    .search-input {
      padding: 5px;
      margin-left: 10px;
    }

    .highlight-text {
      color: red;
    }
  `;

  static properties = {
    treeData: { type: Array },
    selectedNode: { type: Object },
    searchQuery: { type: String },
    rawData: { type: Array },
    catName: { type: String, attribute: 'cat-name' }
  };

  constructor() {
    super();
    this.treeData = [];
    this.selectedNode = null;
    this.searchQuery = '';
    if (!this.catName) this.catName = 'catName';
  }

  willUpdate(changedProperties) {
    if (changedProperties.has("rawData")) {
      this.treeData = this.buildTree(this.rawData);
    }
  }

  // Toolbar control

  expandAll() {
    this.modifyExpandState(this.treeData, true);
  }

  collapseAll() {
    this.modifyExpandState(this.treeData, false);
  }

  modifyExpandState(nodes, state) {
    nodes.forEach(node => {
      node.expanded = state;
      if (node.children && node.children.length) {
        this.modifyExpandState(node.children, state);
      }
    });
    this.requestUpdate();
  }

  handleSearchInput(event) {
    this.searchQuery = event.target.value.toLowerCase();
    this.expandAll(); // Expand all nodes to show matches
  }

  searchHighlight(node) {
    if (this.searchQuery.length > 0) {
      return node[this.catName].toLowerCase().includes(this.searchQuery);
    }
    return false
  }
  // Drag and Drop

  dragStart(e, node) {
    e.dataTransfer.setData('text/plain', JSON.stringify({ source: "treenode", data: node }));
    this.draggedNode = node;
  }


  dragOver(e) {
    e.preventDefault();
  }

  drop(e, targetNode) {
    e.preventDefault();

    const xx = JSON.parse(e.dataTransfer.getData('text/plain'));
    const draggedNodeData = xx.data;
    const draggedSource = xx.source;

    // console.log("drop data: ", draggedNodeData)
    // console.log("target node: ", targetNode)

    if (draggedSource === 'treenode') {
      if (draggedNodeData.id === targetNode.id) {
        return; // drop same node
      }
      // Remove dragged node from its original parent
      this.removeNodeById(this.treeData, draggedNodeData.id);

      // Add dragged node as a child of the target node
      // eslint-disable-next-line no-param-reassign
      targetNode.children = targetNode.children || [];
      targetNode.children.push(draggedNodeData);
    }

    this.dispatchEvent(new CustomEvent('node-drop', { detail: { sourcce: draggedSource, drag: draggedNodeData, target: targetNode } }))

    this.requestUpdate();
  }

  removeNode() {
    if (this.selectedNode !== null) {
      alert(`You are considering remove node: ${JSON.stringify(this.selectedNode)}`);
    }
  }

  newNode() {
    this.dispatchEvent(new CustomEvent('create-newnode', { detail: { currNode: this.selectedNode } }))
  }

  removeNodeById(nodes, nodeId) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === nodeId) {
        nodes.splice(i, 1);
        return true;
        // eslint-disable-next-line no-else-return
      } else if (nodes[i].children && nodes[i].children.length) {
        if (this.removeNodeById(nodes[i].children, nodeId)) {
          return true;
        }
      }
    }
    return false;
  }

  // Treeview core
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

  toggleNode(node) {
    // eslint-disable-next-line no-param-reassign
    node.expanded = !node.expanded;
    this.requestUpdate();
  }

  selectNode(node) {
    this.selectedNode = node;
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent('node-clicked', { detail: node }));
  }

  renderTree(nodes) {
    return nodes.map(node => {
      const isHighlighted = this.searchHighlight(node);
      return html`
        <div
          class="tree-node ${this.selectedNode === node ? 'selected' : ''} ${isHighlighted ? 'highlight' : ''} draggable"
          draggable="true"
          @dragstart=${e => this.dragStart(e, node)}
          @dragover=${this.dragOver}
          @drop=${e => this.drop(e, node)}
        >
          <span class="icon" @click=${() => this.toggleNode(node)}>
            ${node.children && node.children.length ? (node.expanded ? '-' : '+') : ''}
          </span>
          <span @click=${() => this.selectNode(node)}>${this.renderNodeContent(node)}</span>
        </div>
        <div class="tree-children ${node.expanded ? 'expanded' : ''}">
          ${node.children ? this.renderTree(node.children) : ''}
        </div>
      `;
    });
  }

  renderNodeContent(node) {
    if (this.searchQuery.length > 0) {
      const matchIndex = node[this.catName].toLowerCase().indexOf(this.searchQuery);
      if (matchIndex === -1) return node[this.catName];

      const beforeMatch = node[this.catName].slice(0, matchIndex);
      const matchText = node[this.catName].slice(matchIndex, matchIndex + this.searchQuery.length);
      const afterMatch = node[this.catName].slice(matchIndex + this.searchQuery.length);
      // console.log(` ${beforeMatch}<span class="highlight-text">${matchText}</span>${afterMatch}`)
      return html`
        ${beforeMatch}<span class="highlight-text">${matchText}</span>${afterMatch}
      `;
    }
    return node[this.catName]
  }

  render() {
    return html`
    <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
      <div class="w3-bar w3-light-grey w3-padding-small">
        <button class = "w3-bar-item w3-button" @click=${this.expandAll}><i class="fa fa-solid fa-chevron-down"></i></button>
        <button class="w3-bar-item w3-button" @click=${this.collapseAll}><i class="fa fa-solid fa-chevron-up"></i></button>
        <button class="w3-bar-item w3-button" @click=${this.newNode}><i class="fa fa-solid fa-plus"></i></button>
        <button class="w3-bar-item w3-button" @click=${this.removeNode}><i class="fa fa-solid fa-minus"></i></button>
        <input
          class="w3-bar-item w3-input w3-right"
          type="text"
          placeholder="Search..."
          @input=${this.handleSearchInput}
        />
      </div>
      <div>
        ${this.renderTree(this.treeData)}
      </div>
    `;
  }
}

customElements.define('lit-tree-view', LitTreeView);
