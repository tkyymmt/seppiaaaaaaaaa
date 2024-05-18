import { ClientCategory } from "./client_category";

// immutableにしたい
export class Client {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public categories: ClientCategory[],
    ) { }
}
