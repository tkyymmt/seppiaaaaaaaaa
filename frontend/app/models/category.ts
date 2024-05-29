import { Client } from "./client";

export class Category {
    constructor(
        public id: number,
        public name: string,
        public clients: Client[],
    ) { }
}
