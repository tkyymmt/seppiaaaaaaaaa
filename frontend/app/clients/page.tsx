'use client';

import cx from 'clsx';
import { Suspense, useEffect, useState } from 'react';
import { Table, Checkbox, ScrollArea, Group, Avatar, Text, rem, Button, Container, Modal, TextInput, MultiSelect } from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from '../css/Row.module.css';
import { Client } from '../models/client';
import { z } from 'zod';
import { clientSchema } from '../lib/zod';
import { AnyVariables, DocumentInput, useMutation, useQuery } from 'urql';
import { CREATE_CLIENTS_HASURA, CREATE_CLIENT_HASURA, DELETE_CLIENT_HASURA, GET_CATEGORIES, GET_CLIENTS, UPDATE_CLIENT_HASURA } from '../graphql/queries';
import { Category } from '../models/category';
import Loading from './loading';
import { linkClientsToCategories } from '../lib/api';
import { auth } from '../lib/firebase';


// FIXME: ログインしていないユーザーを/loginにリダイレクトさせる認証ガードを実装する。
export default function ClientsPage() {
  const [selectedClientIds, setSelectedClientIds] = useState<number[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [isClientModalOpened, setIsClientModalOpened] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteConfirmModalOpened, setIsDeleteConfirmModalOpened] = useState(false);
  const [isCategoryModalOpened, setIsCategoryModalOpened] = useState(false);
  const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [createDBClientResult, createDBClient] = useMutation(CREATE_CLIENT_HASURA);
  const [createDBClientsResult, createDBClients] = useMutation(CREATE_CLIENTS_HASURA);
  const [updateDBClientResult, updateDBClient] = useMutation(UPDATE_CLIENT_HASURA);
  const [deleteDBClientResult, deleteDBClient] = useMutation(DELETE_CLIENT_HASURA);
  // const [addCategoriesToClientsResult, addCategoriesToClients] = useMutation(ADD_CATEGORIES_TO_CLIENTS);
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
    },
    validate: {
      name: (value) => (value.length >= 2 ? null : '名前は2文字以上である必要があります。'),
      email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : '有効なメールアドレスを入力してください。'),
    },
  });

  const [clientsResult] = useQuery({ query: GET_CLIENTS });
  const [categoriesResult] = useQuery({ query: GET_CATEGORIES });
  const clientsData = clientsResult.data;
  const categoriesData = categoriesResult.data;



  // FIXME: swr を使用したら簡潔に書けるしキャッシュも上手く扱ってくれる。
  useEffect(() => {
    if (clientsData && clientsData.clients) {
      setClients(clientsData.clients.map((client: any) => new Client(client.id, client.name, client.email, client.categories)));
    }
    if (categoriesData && categoriesData.categories) {
      setCategories(categoriesData.categories.map((category: any) => new Category(category.id, category.name, category.clients)));
    }
  }, [clientsData, categoriesData]); // FIXME: dataの更新のたびにDBからすべてのClientsを取得してしまっている

  const toggleRow = (id: number) =>
    setSelectedClientIds((current: number[]) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  const toggleAll = () =>
    setSelectedClientIds((current) => (current.length === clients.length ? [] : clients.map((item) => item.id)));

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const addNewClient = async (values: any) => {
    try {
      const name = values.name;
      const email = values.email;
      const uid = auth.currentUser?.uid;
      clientSchema.parse({ name, email, uid });
      const response = await createDBClient({ name, email, uid });
      if (response.error) {
        alert(response.error.message);
        return;
      }
      // // FIXME: APIから返ってきたデータをClientオブジェクトへ変換するコンバーターを作るべき
      // useEffectでClientのリストを更新するので不要な様子
      // const newClientData = response.data.insert_clients.returning[0];
      // const newClient = new Client(newClientData.id, newClientData.name, newClientData.email, []);
      // setClients(current => [...current, newClient]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert('An validation error occurred');
      }
    }

    setIsClientModalOpened(false);
    form.reset();
  };

  const updateClient = async (values: any) => {
    if (client === null) return;

    const response = await updateDBClient({ id: client.id, name: values.name, email: values.email });
    if (response.error) {
      alert('Failed to update client');
      return;
    }
    setIsClientModalOpened(false);
    form.reset();
  };

  const deleteClient = async () => {
    if (client === null) return;

    const response = await deleteDBClient({ id: client.id });
    if (response.error) {
      alert('Failed to delete client');
      return;
    }
    setIsDeleteConfirmModalOpened(false);
    setSelectedClientIds([]);
  };

  const rows = filteredClients.map((client) => {
    const selected = selectedClientIds.includes(client.id);
    return (
      <Table.Tr key={client.id} className={cx({ [classes.rowSelected]: selected })}>
        <Table.Td>
          <Checkbox checked={selectedClientIds.includes(client.id)} onChange={() => toggleRow(client.id)} />
        </Table.Td>
        <Table.Td>
          <Group gap="sm">
            <Text size="sm" fw={500}>
              {client.name}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>{client.email}</Table.Td>
        <Table.Td>
          <Group>
            <Button variant="outline" onClick={() => openClientUpdateDialog(client)}>編集</Button>
            <Button color='red' variant="outline" onClick={() => openClientDeleteDialog(client)}>削除</Button>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  const openClientAddDialog = () => {
    setClient(null);
    form.reset();
    setIsEditing(false);
    setIsClientModalOpened(true);
  }
  const openClientUpdateDialog = (client: Client) => {
    setClient(client);
    form.setValues(client);
    setIsEditing(true);
    setIsClientModalOpened(true);
  }
  const openClientDeleteDialog = (client: Client) => {
    setClient(client);
    setIsDeleteConfirmModalOpened(true)
  }

  const pickClientsCSV = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const contents = event.target?.result as string;
          const lines = contents.split('\n');
          lines.shift(); // 1行目をヘッダーとして削除
          const newClientsObj = lines.map((line) => {
            const [name, email] = line.split(',');
            const obj = { name: name, email: email, uid: auth.currentUser?.uid };
            try {
              clientSchema.parse(obj);
            } catch (error) {
              return;
            }
            return obj;
          }).filter((obj) => obj !== undefined) as { name: string, email: string, uid: string }[];

          const response = await createDBClients({ clients: newClientsObj });
          if (response.error) {
            alert(response.error.message);
            return;
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  const openCategoryAddDialog = () => {
    setIsCategoryModalOpened(true);
  }
  const addClientsToCategory = async (categoryNames: string[]) => {
    if (categoryNames.length === 0) return;

    const selectedCategoryIds = categories.filter((category) => {
      return categoryNames.includes(category.name);
    }).map((category) => category.id);

    const response = await linkClientsToCategories({ clientIds: selectedClientIds, categoryIds: selectedCategoryIds });
    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message);
      return;
    }

    setIsCategoryModalOpened(false);
    setSelectedCategoryNames([]);
    setSelectedClientIds([]);
  }

  return (
    <Suspense fallback={<Loading />}>
      <Container size="md" my={40}>
        <ScrollArea>
          {/* 顧客モーダル Add or Edit */}
          <Modal opened={isClientModalOpened} onClose={() => setIsClientModalOpened(false)} title={isEditing ? "顧客編集" : "顧客追加"}>
            <form onSubmit={form.onSubmit(isEditing ? updateClient : addNewClient)}>
              <TextInput label="名前" {...form.getInputProps('name')} />
              <TextInput mt="sm" label="メールアドレス" {...form.getInputProps('email')} />
              <Group justify="right" mt="md">
                <Button type="submit">{isEditing ? "編集" : "追加"}</Button>
              </Group>
            </form>
          </Modal>

          {/* 顧客削除モーダル */}
          <Modal opened={isDeleteConfirmModalOpened} onClose={() => setIsDeleteConfirmModalOpened(false)} title="顧客削除">
            <Text size='sm'>削除しますがよろしいですか？</Text>
            <Group justify="right" mt="md">
              <Button color='red' onClick={deleteClient}>削除</Button>
            </Group>
          </Modal>

          {/* 顧客カテゴリー用モーダル */}
          <Modal opened={isCategoryModalOpened} onClose={() => setIsCategoryModalOpened(false)} title="顧客カテゴリーに追加">
            <MultiSelect
              label="カテゴリーを選択"
              placeholder="カテゴリーを選択"
              data={categories.map((category) => category.name)}
              value={selectedCategoryNames}
              onChange={setSelectedCategoryNames}
            />
            <Group justify="right" mt="md">
              <Button onClick={() => addClientsToCategory(selectedCategoryNames)}>追加</Button>
            </Group>
          </Modal>

          <TextInput
            placeholder="名前で検索"
            value={searchText}
            onChange={(event) => setSearchText(event.currentTarget.value)}
            mb="xl"
          />
          <Button mb={20} onClick={() => openClientAddDialog()}>追加</Button>
          <Button ml={20} mb={20} onClick={() => pickClientsCSV()}>CSVをインポート</Button>
          <Button ml={20} mb={20} onClick={() => openCategoryAddDialog()} disabled={selectedClientIds.length === 0}>カテゴリーに追加</Button>
          <Table miw={800} verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: rem(40) }}>
                  <Checkbox
                    onChange={toggleAll}
                    checked={selectedClientIds.length === clients.length}
                    indeterminate={selectedClientIds.length > 0 && selectedClientIds.length !== clients.length}
                  />
                </Table.Th>
                <Table.Th>名前</Table.Th>
                <Table.Th>メールアドレス</Table.Th>
                <Table.Th>アクション</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </Container >
    </Suspense>
  );
}