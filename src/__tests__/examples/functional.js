import {add} from '../../examples/functional.js'
  it('default snapshot for add', () => {
    expect(add(2000,2000)).toMatchSnapshot()
  });