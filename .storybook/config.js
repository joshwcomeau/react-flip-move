import { configure } from '@kadira/storybook';
require('../stories/style.css')

function loadStories() {
  require('../stories/index.js');
  require('../stories/github-issues.js');
}

configure(loadStories, module);
