const assert = require('assert');
import {toc} from '../src/calculo';

describe('toc (dia, hora, min, seg)', function () {
  
  it('should return correct result', function (done) {
    const expected = (4*86400)+(2*3600)+(0*60)+0;
    const result = toc(4, 2, 0, 0);
    assert.equal(expected, result);
    done();
  });
});