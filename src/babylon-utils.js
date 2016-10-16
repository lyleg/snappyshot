/* @flow */
export function getExportNameType(babyParsed:Object):ExportNameType{
  let body = babyParsed.program.body;
  let {exportDeclarationKey, type} = getType(body)

  let exportNamedDeclaration = body[exportDeclarationKey]
  if(exportNamedDeclaration && exportNamedDeclaration.declaration && exportNamedDeclaration.declaration.id && exportNamedDeclaration.declaration.id.name){
    let name = exportNamedDeclaration.declaration.id.name
    return {type:type,name:name}
  }else{
    throw new Error('unable to determine name')
  }
}


function getType(body){//clean this up
  var type, exportDeclarationKey
  if(findKey(body, 'ExportDefaultDeclaration')){
    type =  'default'
    exportDeclarationKey = findKey(body, 'ExportDefaultDeclaration')
  } else if(findKey(body, 'ExportNamedDeclaration')){
    type = 'named',
    exportDeclarationKey = findKey(body, 'ExportNamedDeclaration')
  }

  return {
    type: type,
    exportDeclarationKey:exportDeclarationKey
  }

}

function findKey(body, declarationType){
  return Object.keys(body).find(searchKey => body[searchKey].type === declarationType)
}
