export interface AcademyLesson {
  id: string
  title: string
  videoUrl: string
  description?: string
  category?: string
  createdAt: string
  deletedAt?: string | null
}
