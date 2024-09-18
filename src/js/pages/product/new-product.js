/* eslint-disable no-return-assign */
import { LitElement, html } from 'lit';
import { asyncFetch, isValidDateStrict } from '../../core/hook.js';

export class NewProduct extends LitElement {
  static properties = {
    nameStr: { type: String },
    MeasId: { type: String },
    extraCategoryID: { type: String },
    minimumStock: { type: Number },
    mayBeBuy: { type: Boolean },
    mayBeSell: { type: Boolean },
    mayBeProduce: { type: Boolean },
    canSellWithOutStock: { type: Boolean },
    disContinue: { type: Boolean },
    classPriceID: { type: String },
    segmentID: { type: String },
    comment: { type: String },
  };

  constructor() {
    super();
    this.nameStr = '';
    this.MeasId = '';
    this.extraCategoryID = '';
    this.minimumStock = 0;
    this.mayBeBuy = false;
    this.mayBeSell = false;
    this.mayBeProduce = false;
    this.canSellWithOutStock = false;
    this.disContinue = false;
    this.classPriceID = '';
    this.segmentID = '';
    this.comment = '';
  }

  async saveProduct(event) {
    event.preventDefault();
    try {
      const response = await asyncFetch(
        'POST',
        window.sqlHost,
        `/product-service/product`,
        window.token,
        window.username,
        {
          nameStr: this.nameStr,
          MeasId: this.MeasId,
          extraCategoryID: this.extraCategoryID,
          minimumStock: this.minimumStock,
          mayBeBuy: this.mayBeBuy,
          mayBeSell: this.mayBeSell,
          mayBeProduce: this.mayBeProduce,
          canSellWithOutStock: this.canSellWithOutStock,
          disContinue: this.disContinue,
          classPriceID: this.classPriceID,
          segmentID: this.segmentID,
          comment: this.comment,
        },
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();

      if (data) {
        this.saveProductRelation(data.id);
        this.dispatchEvent(
          new CustomEvent('addnew-employee', {
            bubbles: true,
            composed: true,
            detail: data, // { ...data, parentId: this.parentId },
          }),
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  async saveProductRelation(empId) {
    try {
      const response = await asyncFetch(
        'POST',
        window.sqlHost,
        `/employee-service/employeeRelation`,
        window.token,
        window.username,
        {
          relTable: 'department',
          relId: this.deptId,
          employeeId: empId,
          relType: 'job history',
          relData: `{"startDate": "${isValidDateStrict(this.startDate) ? this.startDate : null}"}`,
        },
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();

      if (data) {
        //
      }
    } catch (e) {
      console.log(e);
    }
  }

  cancelDetail(event) {
    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent('cancel-detail', {
        bubbles: true,
        composed: true,
        detail: { back: 'showproduct' },
      }),
    );
  }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
      <div class="w3-row">
        <span class="w3-xxlarge w3-text-indigo">Thêm một sản phẩm</span>
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <div class="w3-col m3">
          <label>Tên sản phẩm</label>
          <input
            type="text"
            class="w3-input"
            .value=${this.nameStr}
            @input=${e => (this.nameStr = e.target.value)}
          />
        </div>
        <div class="w3-col m3" style="padding-left: 10px">
          <label>Tên</label>
          <input
            type="text"
            class="w3-input"
            .value=${this.firstName}
            @input=${e => (this.firstName = e.target.value)}
          />
        </div>
        <div class="w3-col m3" style="padding-left: 10px">
          <label>Ngày sinh</label>
          <input
            type="date"
            class="w3-input"
            .value=${this.birthDate}
            @input=${e => (this.birthDate = e.target.value)}
          />
        </div>
        <div class="w3-col m3" style="padding-left: 10px">
          <label>Giới tính</label>
          <select
            class="w3-select"
            .value=${this.sex}
            @change=${e => (this.sex = e.target.value)}
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <div class="w3-col m6">
          <label>Địa chỉ </label>
          <input
            type="text"
            class="w3-input"
            .value=${this.address}
            @input=${e => (this.address = e.target.value)}
          />
        </div>
        <div class="w3-col m3" style="padding-left: 10px">
          <label>Số điện thoại</label>
          <input
            type="text"
            class="w3-input"
            .value=${this.handPhone}
            @input=${e => (this.handPhone = e.target.value)}
          />
        </div>
        <div class="w3-col m3" style="padding-left: 10px">
          <label>Chức danh công việc</label>
          <input
            type="text"
            class="w3-input"
            .value=${this.jobTitle}
            @input=${e => (this.jobTitle = e.target.value)}
          />
        </div>
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <div class="w3-col m4">
          <input
            class="w3-check"
            type="checkbox"
            .checked=${this.IsUser}
            @click=${() => {
              this.IsUser = !this.IsUser;
            }}
          />
          <label
            >${this.IsUser ? 'Được quyền ' : 'Không được '} sử dụng phần
            mềm</label
          >
        </div>
        <div class="w3-col m4" style="padding-left: 10px">
          <label>${this.IsUser ? 'User name' : 'Email'}</label>
          <input
            type="text"
            class="w3-input"
            .value=${this.email}
            @input=${e => (this.email = e.target.value)}
          />
        </div>
        <div class="w3-col m4" style="padding-left: 10px">
          <label>Ngày bắt đầu làm việc</label>
          <input
            type="date"
            class="w3-input"
            .value=${this.startDate}
            @input=${e => (this.startDate = e.target.value)}
          />
        </div>
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <label>Mô tả công việc</label>
        <textarea
          rows="4"
          type="text"
          class="w3-input"
          .value=${this.jobDescription}
          @input=${e => (this.jobDescription = e.target.value)}
        ></textarea>
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <button
          class="w3-button w3-teal w3-round-xlarge"
          @click=${this.saveProduct}
        >
          Save
        </button>
        <button
          class="w3-button w3-khaki w3-round-xlarge"
          @click=${this.cancelDetail}
        >
          Cancel
        </button>
      </div>
    `;
  }
}
