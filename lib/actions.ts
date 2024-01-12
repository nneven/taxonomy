"use server"

export async function uploadFile(prevState: any, formData: FormData) {
  const files = formData.getAll("file") as File[]
  files.forEach((file) => {
    console.log("name:", file.name, "size:", file.size)
  })
  return {
    message: "Please enter a valid email",
  }
}
