import { configure } from '@kadira/storybook';

function loadStories() {
  require('../stories/index.js');
  require('../stories/github-issues.js');
}

configure(loadStories, module);
