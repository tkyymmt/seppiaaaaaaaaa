'use client';

import { useMutation, useQuery } from 'urql';
import { CREATE_CLIENT, GET_CLIENTS } from './graphql/client';
import { useState } from 'react';
import { Client } from './models/client';

// FIXME: prisma, hasuraのテスト用の一時的なもの
export default function HomePage() {
   const [result] = useQuery({ query: GET_CLIENTS });
  const { data, fetching, error } = result;
  
  const [createClientResult, createClient] = useMutation(CREATE_CLIENT);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await createClient({ name, email });
    setName('');
    setEmail('');
  };

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <div>
      <h1>Create Client</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Create Client</button>
      </form>

      <h1>Client List</h1>
      <ul>
        {data.clients.map((client: Client) => (
          <li key={client.id}>
            {client.name} - {client.email}
          </li>
        ))}
      </ul>
    </div>
  );

}
