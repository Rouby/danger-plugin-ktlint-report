// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { DangerDSLType } from "danger"
import { readFileSync } from "fs"
import { scanReport } from "./scan/checkstyle"

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
  const glob = require("glob")
  const xmlConverter = require("xml-js")
  const root = process.cwd()
  const git = danger.git

  glob.sync(KTLINT_REPORT_PATH_MASK).forEach(fileName => {
    const reportJson = readFileSync(fileName)
    const report = xmlConverter.xml2js(reportJson)

    scanReport(git, report, root, (msg, file, line) => {
      message(msg, file, line)
    })
  })
}
