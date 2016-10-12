import renderer from 'react-test-renderer'
import Link from ./link
  it('default snapshot for Link', () => {
    const tree = renderer.create(
      <Link  page = "abcdefghijklmnopqrstuvwxyz">abcdefghijklmnopqrstuvwxyz</Link>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });