
/**
 * Enum con los tipos de archivos más relevantes para la aplicación
 */
export enum EFileType {
  // Documentos
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PPT = 'application/vnd.ms-powerpoint',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  TXT = 'text/plain',
  RTF = 'application/rtf',

  // Imágenes
  JPG = 'image/jpeg',
  PNG = 'image/png',
  GIF = 'image/gif',
  BMP = 'image/bmp',
  SVG = 'image/svg+xml',
  WEBP = 'image/webp',

  // Archivos comprimidos
  ZIP = 'application/zip',
  RAR = 'application/vnd.rar',
  TAR = 'application/x-tar',
  GZ = 'application/gzip',

  // Archivos de datos
  CSV = 'text/csv',
  JSON = 'application/json',
  XML = 'application/xml',

  // Archivos de audio
  MP3 = 'audio/mpeg',
  WAV = 'audio/wav',
  OGG = 'audio/ogg',

  // Archivos de video
  MP4 = 'video/mp4',
  AVI = 'video/x-msvideo',
  MOV = 'video/quicktime',
  WMV = 'video/x-ms-wmv',

  // Todos los tipos de imagen
  ALL_IMAGES = 'image/*',

  // Todos los tipos de documento
  ALL_DOCUMENTS = 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,application/rtf',

  // Todos los tipos de archivo
  ALL_FILES = '*/*'
}

/**
 * Interfaz para el callback del archivo seleccionado
 */
export interface IFileSelectedCallback {
  (file: File): void
}

/**
 * Interfaz para las opciones del trigger de archivo
 */
export interface ITriggerFileInputOptions {
  accept?: EFileType
  multiple?: boolean
  onFileSelected?: IFileSelectedCallback
}

/**
 * Método mejorado para abrir el selector de archivos
 * @param options - Opciones para configurar el input de archivo
 */
export const triggerFileInput = (options: ITriggerFileInputOptions = {}): void => {
  const {
    accept = EFileType.ALL_FILES,
    multiple = false,
    onFileSelected
  } = options

  const input = document.createElement('input')
  input.type = 'file'
  input.accept = accept
  input.multiple = multiple
  input.style.display = 'none'

  input.onchange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = target.files

    if (files && files.length > 0 && onFileSelected) {
      if (multiple) {
        // Si es múltiple, llamar al callback con todos los archivos
        Array.from(files).forEach(file => {
          onFileSelected(file)
        })
      } else {
        // Si es único, llamar al callback con el primer archivo
        const file = files[0]
        onFileSelected(file)
      }
    }

    document.body.removeChild(input)
  }

  document.body.appendChild(input)
  input.click()
}

/**
 * Interfaz para las opciones de captura de cámara
 */
export interface ICameraOptions {
  width?: number
  height?: number
  quality?: number
  facingMode?: 'user' | 'environment'
  onPhotoTaken?: (file: File) => void
  onError?: (error: Error) => void
}

/**
 * Función para capturar una foto usando la cámara
 */
export const capturePhotoFromCamera = async(options: ICameraOptions = {}): Promise<void> => {
  const {
    quality = 0.9,
    facingMode = 'environment',
    onPhotoTaken,
    onError
  } = options

  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Cámara no soportada en este navegador')
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode }
    })

    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!

    // Crear modal
    const modal = document.createElement('div')
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.9); display: flex; flex-direction: column;
      align-items: center; justify-content: center; z-index: 10000;
    `

    video.style.cssText = 'width: 80%; max-width: 500px; border-radius: 8px;'
    video.srcObject = stream
    video.autoplay = true
    video.playsInline = true

    const buttonsDiv = document.createElement('div')
    buttonsDiv.style.cssText = 'display: flex; gap: 20px; margin-top: 20px;'

    const captureBtn = document.createElement('button')
    captureBtn.textContent = 'Tomar Foto'
    captureBtn.style.cssText = `
      padding: 12px 24px; background: #007bff; color: white;
      border: none; border-radius: 6px; cursor: pointer; font-size: 16px;
    `

    const cancelBtn = document.createElement('button')
    cancelBtn.textContent = 'Cancelar'
    cancelBtn.style.cssText = `
      padding: 12px 24px; background: #6c757d; color: white;
      border: none; border-radius: 6px; cursor: pointer; font-size: 16px;
    `

    const cleanup = () => {
      stream.getTracks().forEach(track => track.stop())
      modal.remove()
    }

    captureBtn.onclick = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)

      canvas.toBlob((blob) => {
        if (blob && onPhotoTaken) {
          const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' })
          onPhotoTaken(file)
        }
        cleanup()
      }, 'image/jpeg', quality)
    }

    cancelBtn.onclick = cleanup
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') cleanup()
    })

    buttonsDiv.append(captureBtn, cancelBtn)
    modal.append(video, buttonsDiv)
    document.body.appendChild(modal)

  } catch (error) {
    if (onError) onError(error as Error)
  }
}

enum EFileIcons {
  FILE = 'file',
  IMAGE = 'image',
  VIDEO = 'video',
  FOLDER = 'folder',
  EXCEL = 'excel',
  SIGNATURE = 'signature',
  CONTRACT = 'contract',
  FINGERPRINT = 'fingerprint',
  ID_CARD = 'id_card',
  FILE_BOX = 'file_box',
  SECURE_BUILDING = 'secure_building',
  POLICE = 'police'
}

export const DocumentIcon: Record<EFileIcons, string> = {
  [EFileIcons.FILE]: 'fa-solid fa-file-lines',
  [EFileIcons.IMAGE]: 'fa-solid fa-file-image',
  [EFileIcons.VIDEO]: 'fa-solid fa-file-video',
  [EFileIcons.FOLDER]: 'fa-solid fa-folder',
  [EFileIcons.EXCEL]: 'fa-solid fa-file-excel',
  [EFileIcons.SIGNATURE]: 'fa-solid fa-signature',
  [EFileIcons.CONTRACT]: 'fa-solid fa-file-contract',
  [EFileIcons.FINGERPRINT]: 'fa-solid fa-fingerprint',
  [EFileIcons.ID_CARD]: 'fa-solid fa-id-card',
  [EFileIcons.SECURE_BUILDING]: 'fa-solid fa-building-shield',
  [EFileIcons.POLICE]: 'fa-solid fa-hand-middle-finger',
  [EFileIcons.FILE_BOX]: 'fa-solid fa-box-archive'
}

export const downloadFile = (blob: Blob, fileName: string): void => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
