'use client';

import cx from 'clsx';
import { Suspense, useEffect, useState } from 'react';
import { Table, Checkbox, ScrollArea, Group, Text, rem, Button, Container, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from '../css/Row.module.css';
import { Client } from '../models/client';
import { z } from 'zod';
import { categorySchema } from '../lib/zod';
import { useMutation, useQuery } from 'urql';
import { CREATE_CATEGORY_HASURA, DELETE_CATEGORY_HASURA, GET_CATEGORIES, UPDATE_CATEGORY_HASURA } from '../graphql/queries';
import { Category } from '../models/category';
import Loading from './loading';
import { unlinkClientsFromCategories } from '../lib/api';
import { auth } from '../lib/firebase';


// FIXME: ログインしていないユーザーを/loginにリダイレクトさせる認証ガードを実装する。
export default function CategoriesPage() {
  const [selectedCategoryClientIdsPairs, setSelectedCategoryClientIdsPairs] = useState<{ categoryId: number, clientIds: number[] }[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteConfirmModalOpened, setIsDeleteConfirmModalOpened] = useState(false);
  const [isClearConfirmModalOpened, setIsClearConfirmModalOpened] = useState(false);
  const [isCategoryModalOpened, setIsCategoryModalOpened] = useState(false);
  const [createDBCategoryResult, createDBCategory] = useMutation(CREATE_CATEGORY_HASURA);
  const [updateDBCategoryResult, updateDBCategory] = useMutation(UPDATE_CATEGORY_HASURA);
  const [deleteDBCategoryResult, deleteDBCategory] = useMutation(DELETE_CATEGORY_HASURA);
  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: {
      name: (value) => (value.length >= 1 ? null : '名前は必須です。'),
    },
  });

  const [result] = useQuery({ query: GET_CATEGORIES });
  const { data } = result;
  useEffect(() => {
    if (data && data.categories) {
      const fetchedCategories = data.categories.map((category: any) => {
        const clients = category._CategoryToClients.map((clientObj: any) => new Client(clientObj.client.id, clientObj.client.name, clientObj.client.email, clientObj.client.categories));
        return new Category(category.id, category.name, clients);
      });
      setCategories(fetchedCategories);
    }
  }, [data]);

  const toggleRow = (categoryId: number, clientId: number) =>
    setSelectedCategoryClientIdsPairs((pairs) => {
      const pairIndex = pairs.findIndex((pair) => pair.categoryId === categoryId);
      if (pairIndex === -1) {
        return [...pairs, { categoryId, clientIds: [clientId] }];
      }

      const pair = { ...pairs[pairIndex] };
      const isAlreadyChecked = pair.clientIds.includes(clientId);
      if (isAlreadyChecked) {
        pair.clientIds = pair.clientIds.filter((id) => id !== clientId);
      } else {
        pair.clientIds.push(clientId);
      }
      const newPairs = [...pairs];
      newPairs[pairIndex] = pair;

      return newPairs;
    });

  const toggleAll = (category: Category) =>
    setSelectedCategoryClientIdsPairs((pairs) => {
      const isAllSelected = pairs.find((pair) => pair.categoryId === category.id)?.clientIds.length === category.clients.length;
      if (isAllSelected) {
        const newPairs = pairs.filter((pair) => pair.categoryId !== category.id);
        return newPairs;
      } else {
        const newPairs = pairs.filter((pair) => pair.categoryId !== category.id);
        newPairs.push({
          categoryId: category.id,
          clientIds: category.clients.map((client) => client.id),
        });
        return newPairs;
      }
    });


  const addNewCategory = async (values: any) => {
    try {
      const name = values.name;
      const uid = auth.currentUser?.uid;
      categorySchema.parse({ name, uid });
      const response = await createDBCategory({ name, uid });
      if (response.error) {
        alert(response.error.message);
        return;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert('An validation error occurred');
      }
    }

    setIsCategoryModalOpened(false);
    form.reset();
  };

  const updateCategory = async (values: any) => {
    if (category === null) return;

    const response = await updateDBCategory({ id: category.id, name: values.name });
    if (response.error) {
      alert('Failed to update category');
      return;
    }
    setIsCategoryModalOpened(false);
    form.reset();
  };

  const deleteCategory = async () => {
    if (category === null) return;

    const response = await deleteDBCategory({ id: category.id });
    if (response.error) {
      alert('Failed to delete category');
      return;
    }
    setIsDeleteConfirmModalOpened(false);
  };

  const clearClients = async () => {
    if (category === null) return;

    const pair = selectedCategoryClientIdsPairs.find((pair) => pair.categoryId === category.id);
    if (pair) {
      const response = await unlinkClientsFromCategories({ clientIds: pair.clientIds, categoryIds: [category.id] });
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
        return;
      }
    }

    setSelectedCategoryClientIdsPairs([]);
    setIsClearConfirmModalOpened(false);
  };

  const openCategoryAddDialog = () => {
    setCategory(null);
    form.reset();
    setIsEditing(false);
    setIsCategoryModalOpened(true);
  }
  const openCategoryUpdateDialog = (category: Category) => {
    setCategory(category);
    form.setValues(category);
    setIsEditing(true);
    setIsCategoryModalOpened(true);
  }
  const openCategoryDeleteDialog = (category: Category) => {
    setCategory(category);
    setIsDeleteConfirmModalOpened(true)
  }
  const openClientsClearDialog = (category: Category) => {
    setCategory(category);
    setIsClearConfirmModalOpened(true)
  }

  // const pickClientsCSV = async () => {
  //   const input = document.createElement('input');
  //   input.type = 'file';
  //   input.accept = '.csv';
  //   input.onchange = (event) => {
  //     const file = (event.target as HTMLInputElement).files?.[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = async (event) => {
  //         const contents = event.target?.result as string;
  //         const lines = contents.split('\n');
  //         lines.shift(); // 1行目をヘッダーとして削除
  //         const newClientsObj = lines.map((line) => {
  //             const [name, email] = line.split(',');
  //             const obj = { name: name, email: email };
  //             try {
  //               clientSchema.parse(obj);
  //             } catch (error) {
  //               return;
  //             }
  //             return obj;
  //           }).filter((obj) => obj !== undefined) as { name: string, email: string }[];

  //         const response = await createDBClients({ clients: newClientsObj });
  //         if (response.error) {
  //           alert(response.error.message);
  //           return;
  //         }
  //       };
  //       reader.readAsText(file);
  //     }
  //   };
  //   input.click();
  // }

  const categoryHeaderAndClientTable = categories.map((category: Category) => {
    const clientIds = selectedCategoryClientIdsPairs
      .find((pair) => pair.categoryId === category.id)?.clientIds ?? [];
    return (
      <div key={category.id}>
        <Group>
          <h1>{category.name}
          </h1>
          <Button variant="outline" onClick={() => openCategoryUpdateDialog(category)}>編集</Button>
          <Button color='red' variant="outline" onClick={() => openCategoryDeleteDialog(category)}>削除</Button>
          <Button disabled={clientIds.length == 0} onClick={() => openClientsClearDialog(category)}>解除</Button>
        </Group>
        <Table miw={800} verticalSpacing="sm"  >
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: rem(40) }}>
                <Checkbox
                  onChange={() => toggleAll(category)}
                  checked={clientIds.length === category.clients.length}
                  indeterminate={clientIds.length > 0 && clientIds.length !== category.clients.length}
                />
              </Table.Th>
              <Table.Th>名前</Table.Th>
              <Table.Th>メールアドレス</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {category.clients.map((client) => {
              const isSelected = clientIds.includes(client.id);
              return (
                <Table.Tr key={client.id} className={cx({ [classes.rowSelected]: isSelected })}>
                  <Table.Td>
                    <Checkbox checked={isSelected} onChange={() => toggleRow(category.id, client.id)} />
                  </Table.Td>
                  <Table.Td>
                    <Group gap="sm">
                      <Text size="sm" fw={500}>
                        {client.name}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>{client.email}</Table.Td>
                </Table.Tr>
              )
            })}
          </Table.Tbody>
        </Table>
      </div>
    );
  });

  return (
    <Suspense fallback={<Loading />}>
      <Container size="md" my={40}>
        <ScrollArea>
          {/* 顧客カテゴリモーダル Add or Edit */}
          <Modal opened={isCategoryModalOpened} onClose={() => setIsCategoryModalOpened(false)} title={isEditing ? "顧客カテゴリ編集" : "顧客カテゴリ追加"}>
            <form onSubmit={form.onSubmit(isEditing ? updateCategory : addNewCategory)}>
              <TextInput label="名前" {...form.getInputProps('name')} />
              <Group justify="right" mt="md">
                <Button type="submit">{isEditing ? "編集" : "追加"}</Button>
              </Group>
            </form>
          </Modal>

          {/* 顧客カテゴリ削除モーダル */}
          <Modal opened={isDeleteConfirmModalOpened} onClose={() => setIsDeleteConfirmModalOpened(false)} title="顧客カテゴリ削除">
            <Text size='sm'>削除しますがよろしいですか？</Text>
            <Group justify="right" mt="md">
              <Button color='red' onClick={deleteCategory}>削除</Button>
            </Group>
          </Modal>

          {/* 顧客解除モーダル */}
          <Modal opened={isClearConfirmModalOpened} onClose={() => setIsClearConfirmModalOpened(false)} title="顧客解除">
            <Text size='sm'>解除しますがよろしいですか？</Text>
            <Group justify="right" mt="md">
              <Button color='red' onClick={clearClients}>解除</Button>
            </Group>
          </Modal>

          <Button mb={20} onClick={() => openCategoryAddDialog()}>カテゴリ追加</Button>
          {/* <Button ml={20} mb={20} onClick={() => pickCategoriesCSV()}>CSVをインポート</Button> */}
          {categoryHeaderAndClientTable}
        </ScrollArea>
      </Container >
    </Suspense>
  );
}