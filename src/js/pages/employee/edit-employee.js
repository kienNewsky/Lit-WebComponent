/* eslint-disable no-return-assign */
import { LitElement, html } from 'lit';
import { asyncFetch, isValidDateStrict } from '../../core/hook.js';

export class EditEmployee extends LitElement {
  static properties = {
    empId: { type: String },
    deptId: { type: String },
    lastName: { type: String },
    firstName: { type: String },
    jobTitle: { type: String },
    sex: { type: String },
    birthDate: { type: String },
    startDate: { type: String },
    address: { type: String },
    handPhone: { type: String },
    email: { type: String },
    IsUser: { type: Boolean },
    jobDescription: { type: String },
    keyRender: { type: Number },
  };

  constructor() {
    super();
    this.lastName = '';
    this.firstName = '';
    this.jobTitle = '';
    this.sex = 'female';
    this.birthDate = '';
    this.startDate = '';
    this.address = '';
    this.handPhone = '';
    this.email = '';
    this.IsUser = false;
    this.jobDescription = '';

    this.keyRender = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadCurrEmployee();
    this.keyRender += 1;
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('empId') && this.keyRender > 0)
      this.loadCurrEmployee();
  }

  async loadCurrEmployee() {
    try {
      const response = await asyncFetch(
        'GET',
        window.sqlHost,
        `/employee-service/employee/${this.empId}`,
        window.token,
        window.username,
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();

      if (data) {
        // this.saveEmployeeRelation(data.id);
        this.lastName = data.lastName;
        this.firstName = data.firstName;
        this.jobTitle = data.title;
        this.sex = data.sex;
        this.birthDate = data.birthDate;
        // this.startDate = '';
        this.address = data.address;
        this.handPhone = data.handPhone;
        this.email = data.email;
        this.IsUser = data.isUser;
        this.jobDescription = data.jobDescription;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async saveEmployee(event) {
    event.preventDefault();
    try {
      const response = await asyncFetch(
        'PUT',
        window.sqlHost,
        `/employee-service/employee/${this.empId}`,
        window.token,
        window.username,
        {
          lastName: this.lastName,
          firstName: this.firstName,
          title: this.jobTitle,
          sex: this.sex,
          birthDate: isValidDateStrict(this.birthDate) ? this.birthDate : null,
          address: this.address,
          handPhone: this.handPhone,
          email: this.email,
          IsUser: this.IsUser,
          jobDescription: this.jobDescription,
        },
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();

      if (data) {
        // this.saveEmployeeRelation(data.id);
        this.dispatchEvent(
          new CustomEvent('save-edit-employee', {
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

  async saveEmployeeRelation(empId) {
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
        <span class="w3-xxlarge w3-text-indigo">Tuyển dụng một nhân viên</span>
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <div class="w3-col m3">
          <label>Họ</label>
          <input
            type="text"
            class="w3-input"
            .value=${this.lastName}
            @input=${e => (this.lastName = e.target.value)}
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
          @click=${this.saveEmployee}
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
