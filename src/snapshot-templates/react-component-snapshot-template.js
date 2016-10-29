export default function reactComponentSnapshotTemplate(options){
  let {component, componentPath, componentProps, componentChildren, type} = options
  let componentImportString = `${component}`
  if(type === 'ExportNamedDeclaration'){
    componentImportString = '{' + componentImportString + '}'
  }
  let template =
`import renderer from 'react-test-renderer'
import React from 'react'
import ${componentImportString} from '${componentPath}'
  it('default snapshot for ${component}', () => {
    const tree = renderer.create(
      <${component} ${componentProps}>${componentChildren}</${component}>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });`
    return template
  }
