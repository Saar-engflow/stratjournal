export interface AccountListItem {
  id: string
  name: string
  currency: string
  isActive: boolean
  createdAt: Date
  hasTrades: boolean
}

export interface AccountDetail {
  id: string
  name: string
  currency: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
