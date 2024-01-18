import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SourceUploadProps {
  formAction: (payload: globalThis.FormData) => void
}

export function SourceUpload({ formAction }: SourceUploadProps) {
  return (
    <div className="flex h-full">
      <form className="m-auto flex gap-2" action={formAction}>
        <Input type="file" name="files" multiple />
        <Button className="w-fit" variant="outline">
          Upload
        </Button>
      </form>
    </div>
  )
}
