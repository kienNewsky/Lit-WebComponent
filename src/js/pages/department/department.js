/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/**
  customElements.define('newsky-department', Department);
 */
import { LitElement, html, css } from 'lit';
import { asyncFetch } from '../../core/hook.js';

export class Department extends LitElement {
  static properties = {
    mode: { type: String },
    deptId: { type: String },
    deptName: { type: String },
    catRaw: { type: Array },
  };

  constructor() {
    super();
    this.mode = '';
    this.deptId = '';
    this.deptName = '';
    this.catRaw = [];
  }

  connectedCallback() {
    super.connectedCallback();
    // Load department data
    this.loadDataForTreeView();
    this.addEventListener('save-department', this.listenSaveEditItem);
    this.addEventListener('cancel-detail', this.listenCancelDetail);
    this.addEventListener('delete-department', this.listenDelItem);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('save-department', this.listenSaveEditItem);
    this.removeEventListener('cancel-detail', this.listenCancelDetail);
    this.removeEventListener('delete-department', this.listenDelItem);
  }

  async loadDataForTreeView() {
    try {
      const response = await asyncFetch(
        'GET',
        window.sqlHost,
        '/employee-service/department',
        window.token,
        window.username,
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      if (data) this.catRaw = [...data];
    } catch (e) {
      console.log(e);
    }
  }

  listenNodeClick(event) {
    this.deptId = event.detail.data.id;
    this.deptName = event.detail.data.catName;
    this.mode = event.data.key === 'ctrl' ? 'edit' : 'showproduct';
  }

  listenNodeDrop(event) {
    // detail: { source: draggedSource, drag: draggedNodeData, target: targetNode }
    if (event.detail.source === 'treenode') {
      // write code to change isChildOf of draggedNode to targetNode
    }
    if (event.detail.source === 'employee') {
      // write code to move drag employee to targetNode. (Change deptId to id of targetNode)
    }
  }

  listenNewNodeBttClick(event) {
    this.deptId = event.detail.currNode?.id || '';
    // Fire a form to create new item
    this.mode = 'add';
  }

  listenSaveEditItem(event) {
    // Edit node with updated data
  }

  listenDelItem(event) {
    // Remove corresponding node
  }

  listenAddItem(event) {
    // Add new node to treeview end expand the parent node of new node
  }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
      <div class="w3-row">
        <div class="w3-col m5">
          <newsky-treeview
            cat-name="deptName"
            .rawData=${this.catRaw}
            @node-clicked=${this.listenNodeClick}
            @node-drop=${this.listenNodeDrop}
            @create-newnode=${this.listenNewNodeBttClick}
          ></newsky-treeview>
        </div>
        <div class="w3-col m7" style="padding-left: 10px">
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
