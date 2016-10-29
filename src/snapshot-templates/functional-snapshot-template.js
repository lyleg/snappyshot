export default function functionalSnapshotTemplate(options){
  let {name, filePath, signatures, type} = options
  let signatureString = signatures.join(',')
  let importString = name
  if(type === 'ExportNamedDeclaration'){
    importString = '{' + importString + '}'
  }
 let expectation = `expect(${name}(${signatureString})).toMatchSnapshot()`;
  let template =
`import ${importString} from '${filePath}'
  it('default snapshot for ${name}', () => {
    ${expectation}
  });`
    return template
  }
