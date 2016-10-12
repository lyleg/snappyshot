export function getComponentName(babyParsed){
  let body = babyParsed.program.body;
  let exportNamedDeclarationKey = Object.keys(body).find(searchKey => body[searchKey].type === 'ExportNamedDeclaration')
  let exportNamedDeclaration = body[exportNamedDeclarationKey]
  if(exportNamedDeclaration && exportNamedDeclaration.declaration && exportNamedDeclaration.declaration.id && exportNamedDeclaration.declaration.id.name){
    let name = exportNamedDeclaration.declaration.id.name
    return name
  }else{
    throw new Error('unable to determine name')
  }
}
