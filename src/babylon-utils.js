/* @flow */

export function getExports(babyParsed:Object){
  return babyParsed.program.body
   .filter(node => (node.type === 'ExportNamedDeclaration' || node.type === 'ExportDefaultDeclaration'))
}
