export type Order = {
  id: number
  contactEmail: string
  contactName: string
  adress: string
  deliveryMethod: DeliveryMethod
  items: OrderItem[]
  subtotal: number
  status: string
  createdAt: string
}

export type DeliveryMethod = {
  shortName: string
  deliveryTime: string
  description: string
  price: number
}

export type OrderItem = {
  bookId: number
  title: string
  pictureURL: string
  price: number
  quantity: number
}
