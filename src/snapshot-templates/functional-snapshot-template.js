export default function functionalSnapshotTemplate(options){
  let {name, filePath, signatures, exportType} = options
  let signatureString = signatures.map((signature)=>{
    if(Array.isArray(signature) || signature.constructor === {}.constructor){
      return JSON.stringify(signature)
    }else{
      return signature
    }
  }).join(',')
  let importString = name
  if(exportType === 'ExportNamedDeclaration'){
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
