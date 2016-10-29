/* @flow */
import reactComponentSnapshotTemplate from './snapshot-templates/react-component-snapshot-template'
import functionalSnapshotTemplate from './snapshot-templates/functional-snapshot-template'
import {parse as docGenParse} from 'react-docgen'
import {parse as babyParse} from 'babylon'
import {getExports} from './babylon-utils'
import {generateSignaturesFromFlowType} from './data-utils'
import {generateFilePathTraversal} from './utils'
import {mockPropString, getTypeName, generateMockValueFromFlowType, generateMockValue} from './react-utils'

/* potential ideas
generate multiple snapshots with optional permutations for non required and things like boolean
atom plugin
snapshot non react components, babylon parser or recast?
*/

let babyOptions =  {
  sourceType: "module",
  plugins: [
    "jsx",
    "flow"
  ]
}

function generateFunctionalSnapshots(componentSrc:string, filePath:string){
  let babyParsed = babyParse(componentSrc, babyOptions)
  let exportsFromTarget = getExports(babyParsed)

  return exportsFromTarget.map(exportFromTarget => {
    if (exportFromTarget.declaration.type === 'FunctionDeclaration'){
      return functionalSnapshotTemplate({
        type: exportFromTarget.type,
        name: exportFromTarget.declaration.id.name,
        filePath: generateFilePathTraversal(filePath) + filePath,
        signatures: generateSignaturesFromFlowType(exportFromTarget)
      })
    }
    //if class
    //if ?
  })
}

export function generateSnapshot(src:string, filePath:string){
  //return generateReactComponentSnapshot(src, filePath)//if component
  return generateFunctionalSnapshots(src, filePath)
}

 function generateReactComponentSnapshot(componentSrc:string, filePath:string){
    let babyParsed = babyParse(componentSrc, babyOptions)
    let docGenParsed = docGenParse(componentSrc)

    let mockedPropString = mockPropString(docGenParsed)
    let mockedChildrenProp = (docGenParsed.props.children)
      ? generateMockValue('children',docGenParsed.props.children)
      : ''
    let exportFromTarget = getExports(babyParsed)[0]//only supporting one react comp per file
    let exportNameType = {type:exportFromTarget.type, name:exportFromTarget.declaration.id.name}
    filePath = generateFilePathTraversal(filePath) + filePath
    let snapshotString = reactComponentSnapshotTemplate({
      component: exportNameType.name,
      type: exportNameType.type,
      componentPath: filePath,
      componentProps: mockedPropString,
      componentChildren:mockedChildrenProp
    })
    return snapshotString
}
