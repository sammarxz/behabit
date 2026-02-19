export function resizeImageToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const MAX = 256
      let w = img.width,
        h = img.height
      if (w > h && w > MAX) {
        h = Math.round((h * MAX) / w)
        w = MAX
      } else if (h > MAX) {
        w = Math.round((w * MAX) / h)
        h = MAX
      }
      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL("image/jpeg", 0.85))
    }
    img.src = url
  })
}
