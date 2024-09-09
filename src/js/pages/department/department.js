/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
import { LitElement, html, css } from 'lit';
import './dept-detail.js';

class Department extends LitElement {
  static properties = {
    mode: { type: String },
    deptId: { type: String },
    deptName: { type: String },
    catRaw: { type: Array },
  };

  constructor() {
    super();
    this.mode = 'add';
    this.deptId = 'abccdef';
  }

  nodeClick(event) {
    this.deptId = event.detail.data.id;
    this.deptName = event.detail.data.catName;
    this.mode = event.data.key === 'ctrl' ? 'edit' : 'showproduct';
  }

  dropNode(event) {
    // detail: { source: draggedSource, drag: draggedNodeData, target: targetNode }
    if (event.detail.source === 'treenode') {
      // write code to change isChildOf of draggedNode to targetNode
    }
    if (event.detail.source === 'employee') {
      // write code to move drag employee to targetNode. (Change deptId to id of targetNode)
    }
  }

  newNode(event) {
    this.deptId = event.detail.currNode.id;
    this.mode = 'add';
  }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
      <div class="w3-row">
        <div class="w3-col m5">
          <lit-tree-view
            cat-name="nameStr"
            .rawData=${this.catRaw}
            @node-clicked=${this.nodeClick}
            @node-drop=${this.dropNode}
            @create-newnode=${this.newNode}
          ></lit-tree-view>
        </div>
        <div class="w3-col m8">
          <dept-detail
            .mode=${this.mode}
            .deptId=${this.deptId}
            .deptName=${this.deptName}
          ></dept-detail>
        </div>
      </div>
    `;
  }
}

customElements.define('newsky-department', Department);
