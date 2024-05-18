'use client';

import cx from 'clsx';
import { useState } from 'react';
import { Table, Checkbox, ScrollArea, Group, Avatar, Text, rem, Button, Container, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from '../css/Row.module.css';
import { Client } from '../models/client';
import { auth } from '../lib/firebase';

const initialData = [
  new Client('1', 'Robert Wolfkisser', 'rob_wolf@gmail.com', []),
];

// FIXME: ログインしていないユーザーを/loginにリダイレクトさせる認証ガードを実装する。
export default function ClientCategoriesPage() {

  return (
    <Container size="md" my={40}>
      <ScrollArea>
        <Text>顧客カテゴリ</Text>
      </ScrollArea>
    </Container>
  );
}