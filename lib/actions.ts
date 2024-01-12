"use server"

import OpenAI from "openai"
import pdf from "pdf-parse"

import { env } from "@/env.mjs"

export async function uploadFile(prevState: any, formData: FormData) {
  const files = formData.getAll("file") as File[]

  const texts = await Promise.all(
    files.map((file) =>
      file.arrayBuffer().then((buffer) => pdf(buffer).then((data) => data.text))
    )
  )

  const text = texts.join("\n")
  const content = chat(text)

  return { content }
}

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY })

async function chat(content: string) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "Summarize the following text." },
      { role: "user", content },
    ],
    model: "gpt-3.5-turbo",
  })

  // console.log(completion.choices[0])
  return completion.choices[0].message.content
}
