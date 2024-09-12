/* eslint-disable no-unused-vars */
import { LitElement, html, css } from 'lit';
import { asyncFetch } from '../../core/hook.js';

export class ListEmployee extends LitElement {
  static properties = {
    deptId: { type: String },
    deptName: { type: String },
    keyRender: { type: Number },
    empData: { type: Array },
  };

  constructor() {
    super();
    this.keyRender = 0;
    this.empData = [];
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.keyRender === 0) {
      this.loadEmployee();
      this.keyRender = 1;
    }
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('deptId') && this.keyRender === 1)
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
      const data = await response.json();
      if (data) {
        this.empData = [...data];
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />

      <div class="w3-row">
        <span class="w3-xxlarge w3-text-indigo"
          >Các nhân viên thuộc bộ phận: ${this.deptName}</span
        >
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <table class="w3-table w3-bordered">
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
                <tr>
                  <td>${idx + 1}</td>
                  <td>${emp.lastName} ${emp.firstName}</td>
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
