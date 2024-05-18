import { Client } from "./client";

export interface ClientCategory {
    id: string;
    name: string;
    clients: Client[];
}