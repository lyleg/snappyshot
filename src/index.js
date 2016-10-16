/* @flow */
import reactComponentSnapshotTemplate from './reactComponentSnapshotTemplate'
import {parse as docGenParse} from 'react-docgen'
import {parse as babyParse} from 'babylon'
import {getExportNameType} from './babylon-utils'
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


export function generateSnapshot(src:string, filePath:string){
  return generateReactComponentSnapshot(src, filePath)//if component
}

 function generateReactComponentSnapshot(componentSrc:string, filePath:string){
    let babyParsed = babyParse(componentSrc, babyOptions)
    let docGenParsed = docGenParse(componentSrc)

    let mockedPropString = mockPropString(docGenParsed)
    let mockedChildrenProp = (docGenParsed.props.children)
      ? generateMockValue('children',docGenParsed.props.children)
      : ''
    let exportNameType = getExportNameType(babyParsed)
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
