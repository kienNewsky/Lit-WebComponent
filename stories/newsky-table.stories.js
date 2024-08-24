import { html } from 'lit';
import '../src/newsky-table.js';

export default {
  title: 'NewskyTable',
  component: 'newsky-table',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ header, backgroundColor }) {
  return html`
    <newsky-table
      style="--newsky-table-background-color: ${backgroundColor || 'white'}"
      .header=${header}
    >
    </newsky-table>
  `;
}

export const App = Template.bind({});
App.args = {
  header: 'My app',
};
