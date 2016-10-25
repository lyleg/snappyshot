import {parseFlowTypeObject} from '../react-utils'


test('computes simple object', ()=>{

  let simpleObj = {
    foo:'string',
    bar: 'number'
  }
  //expect(parseFlowTypeObject(simpleObj)).toBe(0)
  let twoLevelObj = {
    foo:'string',
    bar: 'number',
    baz:{
      boop:'string',
      beep:'number'
    }
  }
  expect(parseFlowTypeObject(twoLevelObj)).toBe(0)
})
