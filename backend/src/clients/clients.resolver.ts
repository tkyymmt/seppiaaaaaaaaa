import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ClientsService } from './clients.service';
import { Client } from './client.entity';

@Resolver(() => Client)
export class ClientsResolver {
  constructor(private clientsService: ClientsService) {}

  @Query(() => [Client])
  clients() {
    return this.clientsService.findAll();
  }

  @Mutation(() => Client)
  async createClient(
    @Args('name') name: string,
    @Args('email') email: string,
  ) {
    return this.clientsService.createClient({ name, email });
  }
}
