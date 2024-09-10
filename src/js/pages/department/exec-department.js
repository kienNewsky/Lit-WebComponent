// import { AutocompleteComponent } from "../../component/newsky-autocomplete.js";
import { LitTreeView } from '../../component/newsky-treeview.js';

import { EditDepartment } from './edit-department.js';
import { NewDepartment } from './new-department.js';

import { DeptDetail } from './dept-detail.js';
import { Department } from './department.js';

// customElements.define('newsky-autocomplete', AutocompleteComponent);
customElements.define('newsky-treeview', LitTreeView);

customElements.define('edit-department', EditDepartment);
customElements.define('new-department', NewDepartment);

customElements.define('dept-detail', DeptDetail);
customElements.define('newsky-department', Department);
