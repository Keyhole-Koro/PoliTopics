export interface Article {
  id: number
  title: string
  category: string
  keywords: string[]
  participants: number[]
  subtitle?: string
  summary?: string
  middleSummary?: string
  content: DialogEntry[]
}

export interface DialogEntry {
  speaker: number
  text: string
  respondingTo?: number
  summary: string

}

export interface Participant {
  id: number
  name: string
  role: string
}

export interface DifficultWord {
  word: string
  description: string
}

