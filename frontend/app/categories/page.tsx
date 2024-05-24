'use client';

import cx from 'clsx';
import { useEffect, useState } from 'react';
import { Table, Checkbox, ScrollArea, Group, Avatar, Text, rem, Button, Container, Modal, TextInput, MultiSelect } from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from '../css/Row.module.css';
import { Client } from '../models/client';
import { z } from 'zod';
import { categorySchema, clientSchema } from '../lib/zod';
import { useMutation, useQuery } from 'urql';
import { CREATE_CATEGORY_HASURA, DELETE_CATEGORY_HASURA, GET_CATEGORIES, UPDATE_CATEGORY_HASURA } from '../graphql/queries';
import { Category } from '../models/category';


// FIXME: ログインしていないユーザーを/loginにリダイレクトさせる認証ガードを実装する。
export default function CategoriesPage() {
  const [selection, setSelection] = useState<string[]>([]);
  const [category, setCategory] = useState<Category | null>( null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteConfirmModalOpened, setIsDeleteConfirmModalOpened] = useState(false);
  const [isCategoryModalOpened, setIsCategoryModalOpened] = useState(false);
  const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[]>([]);
  const [createDBCategoryResult, createDBCategory] = useMutation(CREATE_CATEGORY_HASURA);
  // const [createDBCategoriesResult, createDBCategories] = useMutation(CREATE_CATEGORIES_HASURA);
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
  const { data, fetching, error } = result;
  useEffect(() => {
    if (data && data.categories) {
      setCategories(data.categories.map((category: any) => new Category( category.id, category.name, category.clients)));
    }
  }, [data]);

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;


  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === categories.length ? [] : categories.map((item) => item.id)));

  const addNewCategory = async (values: any) => {
    try {
      const name = values.name;
      categorySchema.parse({  name });
      const response = await createDBCategory({ name });
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


  const rows = categories.map((category) => {
    const selected = selection.includes(category.id);
    return (
      <Table.Tr key={category.id} className={cx({ [classes.rowSelected]: selected })}>
        <Table.Td>
          <Checkbox checked={selection.includes(category.id)} onChange={() => toggleRow(category.id)} />
        </Table.Td>
        <Table.Td>
          <Group gap="sm">
            <Text size="sm" fw={500}>
              {category.name}
            </Text>
          </Group>
        </Table.Td>
        {/* <Table.Td>{category.clients.map(client => client.name)}</Table.Td> */}
        <Table.Td>
          <Group>
            <Button variant="outline" onClick={() => openCategoryUpdateDialog(category)}>編集</Button>
            <Button color='red' variant="outline" onClick={() => openCategoryDeleteDialog(category)}>削除</Button>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  // FIXME: paginationにする？
  return (
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

        <Button mb={20} onClick={() => openCategoryAddDialog()}>カテゴリ追加</Button>
        {/* <Button ml={20} mb={20} onClick={() => pickCategoriesCSV()}>CSVをインポート</Button> */}
        
        <Table miw={800} verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: rem(40) }}>
                <Checkbox
                  onChange={toggleAll}
                  checked={selection.length === categories.length}
                  indeterminate={selection.length > 0 && selection.length !== categories.length}
                />
              </Table.Th>
              <Table.Th>名前</Table.Th>
              <Table.Th>アクション</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Container >
  );
}