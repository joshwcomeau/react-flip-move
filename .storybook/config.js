import { configure } from '@kadira/storybook';

function loadStories() {
  require('../stories/index.js');
  // require as many as stories you need.
}

configure(loadStories, module);
