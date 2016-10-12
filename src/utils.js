

export function generateFilePathTraversal(filePath:string){
  let depth = computeFileDepth(filePath) + 1 //add one to get out of tests folder
  return [...Array(depth)].reduce(filePathTraversal => filePathTraversal + '../','')
}

export function computeFileDepth(filePath:string):number{
  return filePath.split('/').length - 1
}
