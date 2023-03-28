import {describe, expect, test} from '@jest/globals';
const {Signup} = require('./userController')
describe('SignUp', () => {
    test('Signup', () => {
        const user = {

        }
        expect(Signup()).toBe(true);
    });
});