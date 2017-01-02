test('placeholder', ()=>{
  expect(1).toBe(1)
})
/*require("harmonize")();
import {computeFileDepth, generateFilePathTraversal} from '../utils.js'

console.log('sdf')

//commenting out these tests until I can find a way for Jest to use harmony
test('computes proper file depth', ()=>{
  expect(computeFileDepth('foo.js')).toBe(0)
  expect(computeFileDepth('foo/foo.js')).toBe(1)
  expect(computeFileDepth('foo/bar/foo.js')).toBe(2)
})

test('generate proper traversal', ()=>{
  expect(generateFilePathTraversal('foo.js')).toBe('../')
  expect(generateFilePathTraversal('foo/foo.js')).toBe('../../')
  expect(generateFilePathTraversal('foo/bar/foo.js')).toBe('../../../')
})
*/
