import { nanoid } from 'nanoid';

export type CartType = {
  id: string;
  items: CartItem[];
  deliveryMethodId?: number;
}

export type CartItem = {
  bookId : number;
  bookName: string;
  authorName: string;
  price: number;
  quantity: number;
  quantityInStock: number;
  pictureURL: string;
}

export class Cart implements CartType {
  id = nanoid();
  items: CartItem[] = [];
  deliveryMethodId?: number;
}