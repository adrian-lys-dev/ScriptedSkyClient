import { Author } from "./author";
import { Genre } from "./genre";
import { Publisher } from "./publisher";

export type Book = {
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
}
