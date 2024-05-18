'use client';

import cx from 'clsx';
import { useState } from 'react';
import { Table, Checkbox, ScrollArea, Group, Avatar, Text, rem, Button, Container, Modal, TextInput, MultiSelect } from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from '../css/Row.module.css';
import { Client } from '../models/client';

const initialClients = [
  new Client('1', 'Robert Wolfkisser', 'rob_wolf@gmail.com', []),
];

const categories = ['カテゴリー1', 'カテゴリー2', 'カテゴリー3'];

// FIXME: ログインしていないユーザーを/loginにリダイレクトさせる認証ガードを実装する。
export default function ClientsPage() {
  const [selection, setSelection] = useState<string[]>([]);
  const [clients, setClients] = useState(initialClients);
  const [client, setClient] = useState<Client | null>(null);
  const [isClientModalOpened, setIsClientModalOpened] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteConfirmModalOpened, setIsDeleteConfirmModalOpened] = useState(false);
  const [isCategoryModalOpened, setIsCategoryModalOpened] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
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

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === clients.length ? [] : clients.map((item) => item.id)));

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const addNewClient = (values: any) => {
    // FIXME: idを自動生成する
    const newClient = new Client(String(clients.length + 1), values.name, values.email, []);
    setClients(current => current === null ? [newClient] : [...current!, newClient]);
    setIsClientModalOpened(false);
    form.reset();
  };

  const updateClient = (values: any) => {
    if (client === null) return;

    client.name = values.name;
    client.email = values.email;
    setClients(current => current.map((c) => c.id === client.id ? client : c));
    setIsClientModalOpened(false);
    form.reset();
  };

  const deleteClient = () => {
    if (client === null) return;

    const newClients = clients.filter(c => c.id !== client.id);
    setClients(newClients);
    setIsDeleteConfirmModalOpened(false);
  };

  const rows = filteredClients.map((client) => {
    const selected = selection.includes(client.id);
    return (
      <Table.Tr key={client.id} className={cx({ [classes.rowSelected]: selected })}>
        <Table.Td>
          <Checkbox checked={selection.includes(client.id)} onChange={() => toggleRow(client.id)} />
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

  //FIXME:
  const pickClientsCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const contents = event.target?.result as string;
          const lines = contents.split('\n');
          lines.shift(); // 1行目をヘッダーとして削除
          const newClients = lines.map((line) => {
            const [name, email] = line.split(',');
            return new Client(String(clients.length + 1), name, email, []);
          });
          setClients(current => [...current, ...newClients]);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  const openCategoryAddDialog = () => {
    setIsCategoryModalOpened(true);
  }
  const addClientsToCategory = (category: string[]) => {
    if (category === null) return;

    // FIXME: 選択された顧客を指定されたカテゴリーに追加するロジックを実装
    console.log(`Selected clients: ${selection} will be added to category: ${category}`);
    setIsCategoryModalOpened(false);
    setSelectedCategories([]);
  }

  // FIXME: paginationにする？
  return (
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
            data={categories}
            value={selectedCategories}
            onChange={setSelectedCategories}
          />
          <Group justify="right" mt="md">
            <Button onClick={() => addClientsToCategory(selectedCategories)}>追加</Button>
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
        <Button ml={20} mb={20} onClick={() => openCategoryAddDialog()} disabled={selection.length === 0}>カテゴリーに追加</Button>
        <Table miw={800} verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: rem(40) }}>
                <Checkbox
                  onChange={toggleAll}
                  checked={selection.length === clients.length}
                  indeterminate={selection.length > 0 && selection.length !== clients.length}
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
  );
}