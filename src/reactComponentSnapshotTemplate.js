export default function snapshotTemplate(options){
  let {component, componentPath, componentProps, componentChildren} = options
  let template =
`import renderer from 'react-test-renderer'
import ${component} from '${componentPath}'
  it('default snapshot for ${component}', () => {
    const tree = renderer.create(
      <${component} ${componentProps}>${componentChildren}</${component}>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });`
    return template
  }
