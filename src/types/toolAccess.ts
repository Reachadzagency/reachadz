export interface ToolAccessEntry {
  id: string
  toolName: string
  memberId: string
  memberName: string
  note?: string
  createdAt: string
  deletedAt?: string | null
}
