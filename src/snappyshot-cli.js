#!/usr/bin/env node --harmony
/* @flow */

/*
 default - scaffolds files with placeholders
 min - just scaffolds the __tests__ files with the subject imported
 guess - generates input from flow and proptype
*/

var argv = require('nomnom')
  .script('snappyshot')
  .help('help content')
  .options({
    filePaths:{
      position:0,
      help: 'File or directory plz',
      metavar: 'PATH',
      list: true
    }
  }).parse()

  let fs = require('fs')
  //let node-dir = require('node-dir')
  let path = require('path')
  let toPromise = require('denodeify')
  let filePaths = argv.filePaths
  let generateSnapshot = require('../dist/index').generateSnapshot
  let {isDir, computeFolderPath} = require('../dist/utils')
  let mkdirp = require('mkdirp')
  let recursive = require('recursive-readdir')
  let to = require('await-to-js').default

  let readFilePromise = toPromise(fs.readFile)

function ignoreFunc(file, stats) {
  if(file.indexOf('test') !== -1){
    return true
  }else{
    return path.extname(file) !== '.js'
  }
}


async function parseFiles(err, files:Array<string>){
  files.forEach(async (filePath)=>{
    let [fileReadErr,fileSrc] = await to(readFilePromise(filePath, { encoding: 'UTF-8' }))
    if(fileReadErr){
      console.log(fileReadErr)
      return
    }
     let snapshot = generateSnapshot(fileSrc, filePath)
     let writeFilePath = '__tests__/' +  filePath
     let writeFolderPath = computeFolderPath(writeFilePath)

     if(!await isDir(writeFolderPath)){
       await toPromise(mkdirp)(writeFolderPath)
     }

     let [writeFileErr, writeFile] = await to(toPromise(fs.writeFile)(writeFilePath, snapshot))
  })
}
  async function readFiles(targetPath:string){
    if(await isDir(targetPath)){
      recursive(targetPath, [ignoreFunc],parseFiles)
    }else{
      parseFiles(false,[targetPath])
    }
 }

readFiles(filePaths[0])
