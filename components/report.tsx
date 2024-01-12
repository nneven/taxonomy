"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Post } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { postPatchSchema } from "@/lib/validations/post"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface ReportProps {
  post: Pick<Post, "id" | "title" | "content" | "published">
}

type FormData = z.infer<typeof postPatchSchema>

export function Report({ post }: ReportProps) {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(postPatchSchema),
  })
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [isMounted, setIsMounted] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true)
    }
  }, [])

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const response = await fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        content: "",
      }),
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your post was not saved. Please try again.",
        variant: "destructive",
      })
    }

    router.refresh()

    return toast({
      description: "Your post has been saved.",
    })
  }

  if (!isMounted) {
    return null
  }

  // async function uploadFile(formData: FormData) {
  //   "use server"
  //   const files = formData.getAll("file") as File[]
  //   files.forEach((file) => {
  //     console.log("name:", file.name, "size:", file.size)
  //   })
  // }

  return (
    <>
      {!post.content && (
        <div className="flex h-full">
          <form className="m-auto flex gap-2" action={"uploadFile"}>
            <Input type="file" name="file" multiple />
            <Button className="w-fit" variant="outline">
              Upload
            </Button>
          </form>
        </div>
      )}
      {!!post.content && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full gap-10">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center space-x-10">
                <Link
                  href="/dashboard"
                  className={cn(buttonVariants({ variant: "ghost" }))}
                >
                  <>
                    <Icons.chevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </>
                </Link>
                <p className="text-sm text-muted-foreground">
                  {post.published ? "Published" : "Draft"}
                </p>
              </div>
              <button type="submit" className={cn(buttonVariants())}>
                {isSaving && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                <span>Save</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  )
}
