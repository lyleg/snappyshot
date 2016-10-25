import {parseFlowTypeObject} from '../react-utils'


test('computes simple object', ()=>{

  let simpleObj = {
    foo:'string',
    bar: 'number'
  }
  expect(parseFlowTypeObject(simpleObj)).toMatchSnapshot()
  let twoLevelObj = {
    foo:'string',
    bar: 'number',
    baz:{
      boop:'string',
      beep:'number'
    }
  }
  expect(parseFlowTypeObject(twoLevelObj)).toMatchSnapshot()
})
