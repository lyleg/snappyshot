/* @flow */

export function getExports(babyParsed:Object){
  return babyParsed.program.body
   .filter(node => (node.type === 'ExportNamedDeclaration' || node.type === 'ExportDefaultDeclaration'))
}

export function parseBodyByType(babyParsed:Object, type: string){
  return babyParsed.program.body
   .filter(node => node.type === type)
}
