export type AdminOrder = {
    id: number
    contactEmail: string
    contactName: string
    adress: string
    deliveryMethod: DeliveryMethod
    items: OrderItem[]
    user: User
    subtotal: number
    status: string
    createdAt: string
    updatedAt: string
}

export type User = {
    id: string,
    firstName: string,
    lastName: string,
    email: string
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
