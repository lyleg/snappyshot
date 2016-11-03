#!/usr/bin/env node
/* @flow */
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




  async function readFiles(filePath:string){//convert to async / await and handle when file doesn't exit
    try{
      let fileSrc = await toPromise(fs.readFile)(filePath, { encoding: 'UTF-8' })
      let snapshot = generateSnapshot(fileSrc, filePath)
      let writeFilePath = '__tests__/' +  filePath
      let writeFolderPath = computeFolderPath(writeFilePath)

      if(!await isDir(writeFolderPath)){
        await toPromise(mkdirp)(writeFolderPath)
      }
      
      await toPromise(fs.writeFile)(writeFilePath, snapshot)
    }catch(e){
      console.log(e)
    }
 }

readFiles(filePaths[0])
