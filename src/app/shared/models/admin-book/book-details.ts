export type BookDetails = {
  id: number;
  title: string;
  description: string;
  pictureURL: string;
  releaseYear: number;
  rating: number;
  pageNumber: number;
  price: number;
  isbn: string;
  quantityInStock: number;
  genre: Genre[];
  author: Author[];
  publisher: Publisher;
  createdAt: string;
  updatedAt: string;
}

export type Genre = {
  id: number;
  name: string;
}

export type Author = {
  id: number;
  name: string;
}

export type Publisher = {
  id: number;
  name: string;
}