export type TeamFunction = "editor" | "filmmaker" | "designer" | "media_buyer" | "manager"
export type PaymentType = "freelancer" | "salary" | "manager"

export interface TeamMember {
  id: string
  fullName: string
  email: string
  phone?: string
  function: TeamFunction
  paymentType: PaymentType
  /** Freelancer: paid per video/projet (rate below). Salary: fixed monthly amount. */
  rate: number
  monthlySalary?: number
  active: boolean
  createdAt: string
  deletedAt?: string | null
}
