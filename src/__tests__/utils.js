import {computeFileDepth, generateFilePathTraversal} from '../utils.js'

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
