/* eslint-disable no-return-assign */
import { LitElement, html } from 'lit';

export class NewEmployee extends LitElement {
  static properties = {
    lastName: { type: String },
    firstName: { type: String },
    jobTitle: { type: String },
    sex: { type: String },
    birthDate: { type: String },
    address: { type: String },
    handPhone: { type: String },
    email: { type: String },
    IsUser: { type: Boolean },
    jobDescription: { type: String },
  };

  constructor() {
    super();
    this.lastName = '';
    this.firstName = '';
    this.jobTitle = '';
    this.sex = 'Nam';
    this.birthDate = '';
    this.address = '';
    this.handPhone = '';
    this.email = '';
    this.IsUser = false;
    this.jobDescription = '';
  }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
      <div class="w3-row">
        <span class="w3-xxlarge w3-text-indigo">Thêm một nhân viên</span>
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
          <select class="w3-select">
            <option value="male" selected>Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>
      </div>
    `;
  }
}
