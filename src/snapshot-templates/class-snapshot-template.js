export default function classSnapshotTemplate(options){
  let {name, filePath, constructorParams, exportType} = options
  let constructorParamsString = constructorParams.map((signature)=>{
    if(Array.isArray(signature)){
      return JSON.stringify(signature)
    }else{
      return signature
    }
  }).join(',')
  let importString = name
  if(exportType === 'ExportNamedDeclaration'){
    importString = '{' + importString + '}'
  }
 let expectation = `expect(${name}(${constructorParamsString})).toMatchSnapshot()`;
  let template =
`import ${importString} from '${filePath}'
  it('default snapshot for ${name}', () => {
    ${expectation}
  });`
    return template
  }
