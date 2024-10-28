import { AutocompleteComponent } from '../../component/newsky-autocomplete.js';
import { LitTreeView } from '../../component/newsky-treeview.js';
import { NewskyTable } from '../../component/newsky-table.js';
import { NewskySelectMeasCat } from '../../component/newsky-select-meascat.js';
import { NewskySelectMeas } from '../../component/newsky-select-meas.js';
import { NewskySelectSegment } from '../../component/newsky-select-segment.js';
import { NewskyCategoryChain } from '../../component/newsky-category-chain.js';
import { NewskySelectClass } from '../../component/newsky-select-class.js';
import { ShowListAttribute } from '../../component/newsky-list-attribute.js';
import { NewskyManageAttribute } from '../../component/newsky-manage-attribute.js';

import { EditAttribute } from './edit-attribute.js';
import { NewAttribute } from './new-attribute.js';

import { ListProduct } from './list-product.js';
import { NewProduct } from './new-product.js';
import { EditProduct } from './edit-product.js';

import { AttrDetail } from './attr-detail.js';
import { Attribute } from './attribute.js';

customElements.define('newsky-autocomplete', AutocompleteComponent);
customElements.define('newsky-treeview', LitTreeView);
customElements.define('newsky-table', NewskyTable);
customElements.define('newsky-select-meas-cat', NewskySelectMeasCat);
customElements.define('newsky-select-meas', NewskySelectMeas);
customElements.define('newsky-select-segment', NewskySelectSegment);
customElements.define('newsky-category-chain', NewskyCategoryChain);
customElements.define('newsky-select-class', NewskySelectClass);
customElements.define('show-list-attribute', ShowListAttribute);
customElements.define('newsky-manage-attribute', NewskyManageAttribute);

customElements.define('edit-attribute', EditAttribute);
customElements.define('new-attribute', NewAttribute);

customElements.define('list-product', ListProduct);
customElements.define('new-product', NewProduct);
customElements.define('edit-product', EditProduct);

customElements.define('cat-detail', AttrDetail);
customElements.define('newsky-attribute', Attribute);
