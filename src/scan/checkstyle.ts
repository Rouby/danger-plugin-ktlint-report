import { GitDSL } from "danger"
import { isFileInChangeset } from "../file/file"
type MarkdownString = string

/**
 *
 * @param git Git object used to access changesets
 * @param report JavaScript object representation of the checkstyle report
 * @param root Root directory to sanitize absolute paths
 */
export function scanReport(
  git: GitDSL,
  report: any,
  root: string,
  messageCallback: (msg: MarkdownString, fileName: string, line: number) => void
): void {
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
          messageCallback(msg, fileName, line)
        }
      })
    })
  }
}
