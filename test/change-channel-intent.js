'use strict';

/* global describe */
/* global it */

const chai = require('chai');
const expect = chai.expect;

describe('AboutIntent', () => {
    describe('#test()', () => {
        it('should be awesome', () => {
            // arrange
            const expected = 1;

            // act
            const actual = 1;

            // assert
            expect(actual).to.equal(expected);
        });
    });
});
