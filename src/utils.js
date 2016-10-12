

export function generateFilePathTraversal(filePath:string){
  let depth = computeFileDepth(filePath)
  return [...Array(depth)].reduce(filePathTraversal => filePathTraversal + '../','')
}

function computeFileDepth(filePath:string):number{
  return filePath.split('/').length
}
