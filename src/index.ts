// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { GitDSL } from "danger/distribution/dsl/GitDSL"
import { readFileSync } from "fs"
import { DangerDSLType } from "../node_modules/danger/distribution/dsl/DangerDSL"

declare var danger: DangerDSLType
type MarkdownString = string
export declare function message(message: MarkdownString, file?: string, line?: number): void

export declare function warn(message: string): void
export declare function fail(message: string): void
export declare function markdown(message: string): void

const KTLINT_REPORT_PATH_MASK = "**/reports/ktlint/*.xml"

/**
 * This plugin reads ktlint reports (checkstyle) and posts inline comments in pull requests.
 */
export function scan() {
  // Replace this with the code from your Dangerfile
  // const title = danger.github.pr.title

  const glob = require("glob")
  const xmlConverter = require("xml-js")
  const root = process.cwd()
  const git = danger.git

  // how to read a file:
  glob.sync(KTLINT_REPORT_PATH_MASK).forEach(fileName => {
    const reportJson = readFileSync(fileName)
    const report = xmlConverter.xml2js(reportJson)

    scanReport(git, report, root)
  })
}

/**
 * If a git object is supplied, this function checks if a given relative file path
 * is within the changeset (modified + created files).
 * @param git Git object
 * @param relativeFilePath Sanitized file path to match with the changeset
 */
function isFileInChangeset(git: GitDSL | undefined, relativeFilePath: string): boolean {
  if (git) {
    const isModified = git.modified_files.includes(relativeFilePath)
    const isAdded = git.created_files.includes(relativeFilePath)

    if (isModified || isAdded) {
      return true
    }
  } else {
    return true
  }
  return false
}

/**
 *
 * @param git Git object used to access changesets
 * @param report JavaScript object representation of the checkstyle report
 * @param root Root directory to sanitize absolute paths
 */
function scanReport(git, report, root): void {
  if (report.elements && report.elements[0].elements) {
    report.elements[0].elements.forEach(fileElement => {
      const fileName = fileElement.attributes.name.replace(root, "").replace(/^\/+/, "")

      fileElement.elements.forEach(errorElement => {
        const attributes = errorElement.attributes
        const line = attributes.line
        const column = attributes.column
        const severity = attributes.severity
        const msg = attributes.message

        if (isFileInChangeset(git, fileName)) {
          message(msg, fileName, line)
        }
      })
    })
  }
}
