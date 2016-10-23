/* eslint-disable */
import { configure } from '@kadira/storybook';


function loadStories() {
  require('../stories/primary-stories.js');
  require('../stories/enter-leave-animations.js');
  require('../stories/hooks.js');
  require('../stories/special-props.js');
  require('../stories/misc.js');
  require('../stories/github-issues.js');
  require('../stories/index.js');
}

configure(loadStories, module);
