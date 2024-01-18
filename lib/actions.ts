"use server"

import OpenAI from "openai"
import pdf from "pdf-parse"

import { env } from "@/env.mjs"

export async function uploadFile(prevState: any, formData: FormData) {
  const files = formData.getAll("files") as File[]
  files.forEach((file) => console.log(file.name, file.size))

  const texts = await Promise.all(
    files.map((file) =>
      file.arrayBuffer().then((buffer) => pdf(buffer).then((data) => data.text))
    )
  )

  const text = texts.join("\n")
  const content = await chat(text)

  return { content }
}

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY })

async function chat(content: string) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a highly skilled investment analyst recognized for your meticulous and insightful work.

          Objective:
          - Create a detailed due diligence section on a specific investment fund, using data from the provided documents.
          
          Instructions:
          - Write for an expert audience of fund managers and investment professionals, focusing on clarity and precision.
          - Ensure each paragraph and section is concise, purposeful, informative, avoiding fluff or filler content.
          - Each section should be self-contained, articulating key insights and findings directly, do not include a conclusion.
          - Maintain accuracy and depth, explicitly integrating specific facts and quantitative data from the documents.
          - Highlight key findings and offer balanced insights, steering clear of speculation or unfounded assertions.
          - Use markdown effectively (headings, lists, and tables) to organize and present information clearly.`,
      },
      { role: "user", content },
    ],
    model: "gpt-4-1106-preview",
  })

  console.log(completion.choices[0])
  return completion.choices[0].message.content
}
