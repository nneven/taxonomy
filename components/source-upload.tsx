import * as React from "react"
import Image from "next/image"
import { format } from "date-fns"
import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Icons } from "@/components/icons"

interface SourceUploadProps {
  formAction: (payload: globalThis.FormData) => void
}

interface SourceMetadata {
  name: string
  size: number
  type: string
  lastModified: number
}

export function SourceUpload({ formAction }: SourceUploadProps) {
  const [sources, setSources] = React.useState<SourceMetadata[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const sources = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }))
    setSources(sources)
  }

  const SubmitButton = () => {
    "use client"
    const { pending } = useFormStatus()

    return (
      <Button type="submit" disabled={pending}>
        {pending ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            <span>Generating Report</span>
          </>
        ) : (
          <span>Generate Report</span>
        )}
      </Button>
    )
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col justify-center gap-y-4">
      <form className="flex w-full justify-between" action={formAction}>
        <Input
          type="file"
          name="files"
          multiple
          accept="application/pdf"
          onChange={handleInputChange}
          className="hidden"
          id="file-upload"
        />
        <Button asChild variant="outline">
          <label htmlFor="file-upload">
            <Icons.add className="mr-2 h-4 w-4" />
            Upload Files
          </label>
        </Button>
        <SubmitButton />
      </form>
      {true && (
        <Table>
          <TableCaption className="mt-4">
            A list of your sources that will be used to generate report.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Last Modified</TableHead>
              <TableHead className="text-right">Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.map((source) => (
              <TableRow key={source.name}>
                <TableCell>
                  {source.type === "application/pdf" && (
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
                      alt="PDF"
                      width={24}
                      height={30}
                      className="mx-auto"
                    />
                  )}
                </TableCell>
                <TableCell className="max-w-80 truncate font-medium">
                  {source.name}
                </TableCell>
                <TableCell className="text-right">
                  {format(source.lastModified, "Pp")}
                </TableCell>
                <TableCell className="text-right">{`${(
                  source.size /
                  1024 /
                  1024
                ).toFixed(2)} MB`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="text-center">Total</TableCell>
              <TableCell>{sources.length} source(s)</TableCell>
              <TableCell className="text-right">-</TableCell>
              <TableCell className="text-right">
                {`${(
                  sources.reduce((acc, cur) => acc + cur.size, 0) /
                  1024 /
                  1024
                ).toFixed(2)} MB`}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  )
}
