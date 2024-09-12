/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
import { LitElement, html, css } from 'lit';
import { asyncFetch } from '../../core/hook.js';

export class ListEmployee extends LitElement {
  static properties = {
    deptId: { type: String },
    deptName: { type: String },
    keyRender: { type: Number },
    empData: { type: Array },
    selectedValue: { type: String },
  };

  constructor() {
    super();
    this.keyRender = 0;
    this.empData = [];
    this.selectedValue = 'ahead';
  }

  connectedCallback() {
    super.connectedCallback();
    // if (this.keyRender === 0) {
    this.loadEmployee();
    this.keyRender = 1;
    // }
    // console.log('deptName: ', this.deptName, this.deptId);
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('deptId') && this.keyRender > 0)
      this.loadEmployee();
  }

  async loadEmployee() {
    try {
      const response = await asyncFetch(
        'GET',
        window.sqlHost,
        `/employee-service/employee/department/${this.deptId}`,
        window.token,
        window.username,
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.text();
      if (data) {
        this.empData = [...JSON.parse(data)];
      } else {
        this.empData = [];
      }
    } catch (e) {
      console.log(e);
    }
  }

  newEmployee(event) {
    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent('new-employee', {
        bubbles: true,
        composed: true,
        detail: { deptId: this.deptId, deptName: this.deptName },
      }),
    );
  }

  checkOutOfDate(endDate) {
    if (endDate) {
      const empEndDate = new Date(endDate);
      const mNow = new Date();
      if (mNow < empEndDate) {
        return true;
      }
      return false;
    }
    return true;
  }

  employeeClick(emp) {
    // eslint-disable-next-line no-alert
    alert(`Click on ${emp.lastName} ${emp.firstName}`);
  }

  handleRadioChange(e) {
    // Update the selectedValue property based on the selected radio button
    this.selectedValue = e.target.value;
    // this.requestUpdate(); // Request re-render to reflect the changes
  }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />

      <div class="w3-row">
        <span class="w3-large w3-text-indigo"
          >Các nhân viên thuộc bộ phận: ${this.deptName}</span
        >
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <div class="w3-col m3">
          <button
            class="w3-button w3-teal w3-round-xlarge"
            @click=${this.newEmployee}
          >
            Thêm nhân viên
          </button>
        </div>

        <div class="w3-col m3">
          <input
            class="w3-radio"
            type="radio"
            value="ahead"
            name="situation"
            ?checked=${this.selectedValue === 'ahead'}
            @change=${this.handleRadioChange}
          />
          <label>Đang ở bộ phận này</label>
        </div>

        <div class="w3-col m3">
          <input
            class="w3-radio"
            type="radio"
            value="away"
            name="situation"
            ?checked=${this.selectedValue === 'away'}
            @change=${this.handleRadioChange}
          />
          <label>Đã chuyển</label>
        </div>

        <div class="w3-col m3">
          <input
            class="w3-radio"
            type="radio"
            value="all"
            name="situation"
            ?checked=${this.selectedValue === 'all'}
            @change=${this.handleRadioChange}
          />
          <label>Tất cả</label>
        </div>
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <table class="w3-table w3-bordered w3-hoverable">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ và tên</th>
              <th>Ngày sinh</th>
              <th>Số ĐT</th>
              <th>Chức danh</th>
            </tr>
          </thead>
          <tbody>
            ${this.empData.map(
              (emp, idx) => html`
                <tr
                  class="${this.checkOutOfDate(emp.endDate)
                    ? ''
                    : 'w3-text-red'}"
                >
                  <td>${idx + 1}</td>
                  <td>
                    <a href="#" @click=${() => this.employeeClick(emp)}
                      >${emp.lastName} ${emp.firstName}</a
                    >
                  </td>
                  <td>${emp.birthDate.split('-').reverse().join('/')}</td>
                  <td>${emp.handPhone}</td>
                  <td>${emp.title}</td>
                </tr>
              `,
            )}
          </tbody>
        </table>
      </div>
    `;
  }
}
