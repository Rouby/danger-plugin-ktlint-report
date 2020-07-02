// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import {DangerDSLType} from "../node_modules/danger/distribution/dsl/DangerDSL"
import { readFileSync } from 'fs'
import { GitDSL } from "danger/distribution/dsl/GitDSL"

declare var danger: DangerDSLType
type MarkdownString = string
export declare function message(message: MarkdownString, file?: string, line?: number): void

export declare function warn(message: string): void
export declare function fail(message: string): void
export declare function markdown(message: string): void

/**
 * This plugin reads ktlint reports and posts inline comments in pull requests.
 */
export function scan() {
  // Replace this with the code from your Dangerfile
  // const title = danger.github.pr.title

  var glob = require("glob")
  var xmlConverter = require('xml-js')
  let root = process.cwd()
  let git = danger.git
  
  // how to read a file:
  glob.sync("**/reports/ktlint/*.xml").forEach(function (fileName) {
    let coverageJson = readFileSync(fileName);
    let coverage = xmlConverter.xml2js(coverageJson);

    if(coverage.elements && coverage.elements[0].elements) {
      coverage.elements[0].elements.forEach(fileElement => {
        let fileName = fileElement.attributes.name.replace(root, '').replace(/^\/+/, '')

        fileElement.elements.forEach(errorElement => {
          let attributes = errorElement.attributes;
          let line = attributes.line
          let column = attributes.column
          let severity = attributes.severity
          let msg = attributes.message
        
          if(isInChangeset(git, fileName)) {
            message(msg, fileName, line)
          }
        })
      });
    }
  });

}

function isInChangeset(git: GitDSL | undefined, relativeFilePath: string): boolean {
  if(git) {
    let isModified = git.modified_files.includes(relativeFilePath)
    let isAdded = git.created_files.includes(relativeFilePath)

    if(isModified || isAdded) {
      return true;
    }
  } else {
    return true;
  }
  return false;
}
