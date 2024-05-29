import { Category } from "./category";

// immutableにしたい
export class Client {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public categories: Category[],
    ) { }
}
