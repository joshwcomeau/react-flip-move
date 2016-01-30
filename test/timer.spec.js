import chai, { expect } from 'chai';

import { createTimer }  from './helpers/timer.helper.js'


describe('createTimer', () => {
  it('records the time', done => {
    const timer = createTimer();
    timer.start();

    setTimeout( () => {
      const time = timer.end();
      expect(time).to.be.closeTo(400, 50);
      expect(timer.result).to.equal(time);

      timer.reset();
      expect(timer.result).to.equal(null);

      done();
    }, 400)
  })
})
