import { configure } from '@kadira/storybook';
require('../stories/style.css')

function loadStories() {
  require('../stories/index.js');
  require('../stories/issue-31.js');
  require('../stories/issue-45.js');
}

configure(loadStories, module);
