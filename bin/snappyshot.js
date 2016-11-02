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
  let filePaths = argv.filePaths
  let generateSnapshot = require('../dist/index').generateSnapshot
  let isDir = require('../dist/utils').isDir
  let mkdirp = require('mkdirp')


  function readFiles(filePath){//convert to async / await and handle when file doesn't exit
   fs.readFile(filePath, { encoding: 'UTF-8' },async (err, componentSrc)=>{
    let snapshot = generateSnapshot(componentSrc, filePath)
    let writePath = '__tests__/' +  filePath
    if(await isDir(writePath)){
      fs.writeFile(writePath, snapshot, (err)=>{//check for dir, mkdirp if doesn't exist
        if(err){
          console.warn(err)
        }
      })
    }else{
      mkdirp(writePath, function (err) {
        if (err) console.error(err)
          else{
            fs.writeFile(writePath, snapshot, (err)=>{//put in common
              if(err){
                console.warn(err)
              }
            })
          }
        });
      }
   })
 }

readFiles(filePaths[0])
