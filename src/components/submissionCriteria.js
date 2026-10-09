export const submissionCriteria = [
  { field: 'keyArtPortrait', label: 'Key Art (270x390)', accept: '.jpg,.jpeg,.png,.webp', extensions: ['.jpg', '.jpeg', '.png', '.webp'], dimensions: [270, 390] },
  { field: 'keyArtLandscape', label: 'Key Art (800x450)', accept: '.jpg,.jpeg,.png,.webp', extensions: ['.jpg', '.jpeg', '.png', '.webp'], dimensions: [800, 450] },
  { field: 'keyArtWide', label: 'Key Art (1920x720)', accept: '.jpg,.jpeg,.png,.webp', extensions: ['.jpg', '.jpeg', '.png', '.webp'], dimensions: [1920, 720] },
  { field: 'keyArtFullHd', label: 'Key Art (1920x1080)', accept: '.jpg,.jpeg,.png,.webp', extensions: ['.jpg', '.jpeg', '.png', '.webp'], dimensions: [1920, 1080] },
  { field: 'subtitleFile', label: 'Subtitle File SRT', accept: '.srt', extensions: ['.srt'] },
  { field: 'metadataFile', label: 'Meta Data (TXT, DOC or PDF)', accept: '.txt,.doc,.pdf', extensions: ['.txt', '.doc', '.pdf'] },
  { field: 'video', label: 'Video File (MP4)', accept: '.mp4', extensions: ['.mp4'] },
]

export const validateSubmissionFile = async (field, file, packageType) => {
  const criteria = submissionCriteria.find((item) => item.field === field)
  const extension = `.${file.name.split('.').pop().toLowerCase()}`
  if (!file.size || !criteria.extensions.includes(extension)) {
    return `Choose a valid ${criteria.label} file.`
  }

  if (criteria.dimensions) {
    try {
      const image = await createImageBitmap(file)
      const hasExpectedDimensions = image.width === criteria.dimensions[0] && image.height === criteria.dimensions[1]
      image.close()
      if (!hasExpectedDimensions) {
        return `This image must be exactly ${criteria.dimensions[0]}x${criteria.dimensions[1]} pixels.`
      }
    } catch {
      return 'This is not a valid image file.'
    }
  }

  if (field === 'video') {
    const maxSize = packageType === '99' ? 500 * 1024 * 1024 : 3 * 1024 * 1024 * 1024
    const maxSizeLabel = packageType === '99' ? '500 MB' : '3 GB'
    if (file.size > maxSize) return `Video file must be no larger than ${maxSizeLabel}.`
  }

  return ''
}
