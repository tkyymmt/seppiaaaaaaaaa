import { Client } from "./client";

export class Category {
    constructor(
        public id: string,
        public name: string,
        public clients: Client[],
    ) { }
}

