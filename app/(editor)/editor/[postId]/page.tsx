import { notFound, redirect } from "next/navigation"
import { Post, User } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Editor } from "@/components/editor"

async function getPostForUser(postId: Post["id"], userId: User["id"]) {
  return await db.post.findFirst({
    where: {
      id: postId,
      authorId: userId,
    },
  })
}

interface EditorPageProps {
  params: { postId: string }
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const post = await getPostForUser(params.postId, user.id)

  if (!post) {
    notFound()
  }

  async function upload(formData) {
    "use server"
    const file = formData.get("file") as File
    console.log("name:", file.name, "size:", file.size)
  }

  return (
    <>
      <form className="ml-auto flex gap-2" action={upload}>
        <Input type="file" name="file" />
        <Button className="w-fit" variant="outline">
          Upload
        </Button>
      </form>
      <Editor
        post={{
          id: post.id,
          title: post.title,
          content: post.content,
          published: post.published,
        }}
      />
    </>
  )
}
