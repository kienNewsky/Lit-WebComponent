/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/**
  customElements.define('newsky-category', Category);
 */
import { LitElement, html, css } from 'lit';
import { asyncFetch } from '../../core/hook.js';

export class Category extends LitElement {
  static properties = {
    mode: { type: String },
    catId: { type: String },
    catName: { type: String },
    catRaw: { type: Array },
    nodeIdShow: { type: String },
    empId: { type: String },
  };

  constructor() {
    super();
    this.mode = '';
    this.catId = '';
    this.catName = '';
    this.catRaw = [];
    this.nodeIdShow = '';
    this.empId = '';
  }

  connectedCallback() {
    super.connectedCallback();
    // Load category data
    this.loadDataForTreeView();
    this.addEventListener('save-category', this.listenSaveEditItem);
    this.addEventListener('addnew-category', this.listenAddItem);
    this.addEventListener('cancel-detail', this.listenCancelDetail);
    this.addEventListener('delete-category', this.listenDelItem);
    this.addEventListener('new-product', this.listenNewProduct);
    this.addEventListener('addnew-product', this.listenAddNewProduct);
    this.addEventListener('edit-product', this.listenEditProduct);
    this.addEventListener('save-edit-product', this.listenSaveEditProduct);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('save-category', this.listenSaveEditItem);
    this.removeEventListener('addnew-category', this.listenAddItem);
    this.removeEventListener('cancel-detail', this.listenCancelDetail);
    this.removeEventListener('delete-category', this.listenDelItem);
    this.removeEventListener('new-product', this.listenNewProduct);
    this.removeEventListener('addnew-product', this.listenAddNewProduct);
    this.removeEventListener('edit-product', this.listenEditProduct);
    this.removeEventListener('save-edit-product', this.listenSaveEditProduct);
  }

  async loadDataForTreeView() {
    try {
      const response = await asyncFetch(
        'GET',
        window.sqlHost,
        '/product-service/category',
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

  async saveCategory(data) {
    try {
      const response = await asyncFetch(
        'PUT',
        window.sqlHost,
        `/product-service/category/${data.id}`,
        window.token,
        window.username,
        {
          catName: data.catName,
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

    this.catId = event.detail.data.id;
    this.catName = event.detail.data.catName;
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
        catName: dragData.catName,
        tagExtend: dragData.tagExtend,
        isChildOf: targetId,
      };
      const saveDept = this.saveCategory(saveData);
      // update isChildOf of this node in catRaw
      if (saveDept) {
        const catLength = this.catRaw.length;
        for (let i; i < catLength; i += 1) {
          if (this.catRaw[i].id === dragData.id)
            this.catRaw[i].isChildOf = targetId;
        }
      } else {
        alert('There is an error while saving category');
      }
    }
    if (event.detail.source === 'product') {
      // write code to move drag product to targetNode. (Change catId to id of targetNode)
    }
  }

  listenNewNodeBttClick(event) {
    this.catId = event.detail.currNode?.id || '';
    // Fire a form to create new item
    this.mode = 'add';
  }

  listenSaveEditItem(event) {
    // Edit node with updated data
    console.log('data received from event ', event.detail);
    const treeview = this.shadowRoot.querySelector('newsky-treeview');
    if (treeview) {
      treeview.updateNodeName(event.detail.id, event.detail.catName);
    }
    this.mode = '';
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

  listenNewProduct(event) {
    this.mode = 'new-product';
  }

  listenAddNewProduct(event) {
    this.mode = 'showproduct';
  }

  listenEditProduct(event) {
    // console.log(event);

    this.empId = event.detail.Id;
    this.mode = 'edit-product';
  }

  listenSaveEditProduct(event) {
    this.mode = 'showproduct';
  }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
      <div class="w3-row">
        <div class="w3-col m5">
          <newsky-treeview
            cat-name="catName"
            .rawData=${this.catRaw}
            .nodeIdShow=${this.nodeIdShow}
            @node-clicked=${this.listenNodeClick}
            @node-drop=${this.listenNodeDrop}
            @create-newnode=${this.listenNewNodeBttClick}
          ></newsky-treeview>
        </div>
        <div class="w3-col m7" style="padding-left: 10px">
          <cat-detail
            .mode=${this.mode}
            .catId=${this.catId}
            .catName=${this.catName}
            .empId=${this.empId}
          ></cat-detail>
        </div>
      </div>
    `;
  }
}
