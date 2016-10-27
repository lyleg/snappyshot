/* @flow */

export function getExportNameTypeAll(babyParsed:Object):Array<ExportNameType>{
  return babyParsed.program.body
   .filter(node => (node.type === 'ExportNamedDeclaration' || node.type === 'ExportDefaultDeclaration'))
   .map(node => {
     return {type: node.type, name: node.declaration.id.name}
  })
}
