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
    nodeIdShow: { type: String },
    empId: { type: String },
  };

  constructor() {
    super();
    this.mode = '';
    this.deptId = '';
    this.deptName = '';
    this.catRaw = [];
    this.nodeIdShow = '';
    this.empId = '';
  }

  connectedCallback() {
    super.connectedCallback();
    // Load department data
    this.loadDataForTreeView();
    this.addEventListener('save-department', this.listenSaveEditItem);
    this.addEventListener('addnew-department', this.listenAddItem);
    this.addEventListener('cancel-detail', this.listenCancelDetail);
    this.addEventListener('delete-department', this.listenDelItem);
    this.addEventListener('new-employee', this.listenNewEmployee);
    this.addEventListener('addnew-employee', this.listenAddNewEmployee);
    this.addEventListener('edit-employee', this.listenEditEmployee);
    this.addEventListener('save-edit-employee', this.listenSaveEditEmployee);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('save-department', this.listenSaveEditItem);
    this.removeEventListener('addnew-department', this.listenAddItem);
    this.removeEventListener('cancel-detail', this.listenCancelDetail);
    this.removeEventListener('delete-department', this.listenDelItem);
    this.removeEventListener('new-employee', this.listenNewEmployee);
    this.removeEventListener('addnew-employee', this.listenAddNewEmployee);
    this.removeEventListener('edit-employee', this.listenEditEmployee);
    this.removeEventListener('save-edit-employee', this.listenSaveEditEmployee);
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

  async saveDepartment(data) {
    try {
      const response = await asyncFetch(
        'PUT',
        window.sqlHost,
        `/employee-service/department/${data.id}`,
        window.token,
        window.username,
        {
          deptName: data.deptName,
          isActive: data.isActive,
          isChildOf: data.isChildOf,
        },
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const xdata = await response.json();
      if (xdata) {
        return true;
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  listenCancelDetail(event) {
    if (event.detail.back) {
      this.mode = event.detail.back;
    } else {
      this.mode = '';
    }
  }

  listenNodeClick(event) {
    // console.log(event.detail);

    this.deptId = event.detail.data.id;
    this.deptName = event.detail.data.deptName;
    this.mode = event.detail.key === 'ctrl' ? 'edit' : 'showproduct';
  }

  listenNodeDrop(event) {
    // detail: { source: draggedSource, drag: draggedNodeData, target: targetNode }
    // console.log('dragg and drop: ', event.detail);
    if (event.detail.source === 'treenode') {
      // write code to change isChildOf of draggedNode to targetNode
      const dragData = event.detail.drag;
      const targetId = event.detail.target.id;
      const saveData = {
        id: dragData.id,
        deptName: dragData.deptName,
        isActive: dragData.isActive,
        isChildOf: targetId,
      };
      const saveDept = this.saveDepartment(saveData);
      // update isChildOf of this node in catRaw
      if (saveDept) {
        const catLength = this.catRaw.length;
        for (let i; i < catLength; i += 1) {
          if (this.catRaw[i].id === dragData.id)
            this.catRaw[i].isChildOf = targetId;
        }
      } else {
        alert('There is an error while saving department');
      }
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
    const treeview = this.shadowRoot.querySelector('newsky-treeview');
    if (treeview) {
      treeview.updateNodeName(event.detail.id, event.detail.deptName);
    }
  }

  listenDelItem(event) {
    // Remove corresponding node
  }

  listenAddItem(event) {
    // Add new node to treeview end expand the parent node of new node
    // console.log('add item: ', event.detail);
    this.catRaw = [...this.catRaw, event.detail];
    this.nodeIdShow = event.detail.id;
    this.mode = '';
  }

  listenNewEmployee(event) {
    this.mode = 'new-employee';
  }

  listenAddNewEmployee(event) {
    this.mode = 'showproduct';
  }

  listenEditEmployee(event) {
    // console.log(event);

    this.empId = event.detail.Id;
    this.mode = 'edit-employee';
  }

  listenSaveEditEmployee(event) {
    this.mode = 'showproduct';
  }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
      <div class="w3-row">
        <div class="w3-col m5">
          <newsky-treeview
            cat-name="deptName"
            .rawData=${this.catRaw}
            .nodeIdShow=${this.nodeIdShow}
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
            .empId=${this.empId}
          ></dept-detail>
        </div>
      </div>
    `;
  }
}
