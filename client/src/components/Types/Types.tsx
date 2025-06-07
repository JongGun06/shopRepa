//Product
export interface ProductCardType {
    _id?: string
    title: string
    price: number 
    containerCoordinates: {
        x: number
        y: number
    }
    image: string 
    category: string 
    author: string
    quantity: number // было string
    additionalInfo: string
    createDate: string
    sizes: Array<{
        type: string
    }> | null // может быть null, как в бэкенде
}