'use client';

import { login } from '../lib/auth';
import { auth } from '../lib/firebase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Loader,
} from '@mantine/core';
import classes from './LoginPage.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // ローディング状態を管理するための状態変数

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = password.length >= 8;

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        if (!isEmailValid) setError('');
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        if (!isPasswordValid) setError('');
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isEmailValid) {
            setError('Enter a valid email address.');
            return;
        }
        if (!isPasswordValid) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setLoading(true); // ローディング開始
        try {
            await login(email, password);
            if (auth.currentUser !== null) {
                router.push('/');
            } 
        } catch (error:any) {
            setError('Error logging in: ' + error.message);
            console.error('Error logging in:', error);
        } finally {
            setLoading(false); // ローディング終了
        }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                Welcome back!
            </Title>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={handleSubmit}>
                    <TextInput
                        label="Email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={handleEmailChange}
                        type='email'
                        error={error && !isEmailValid}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        required
                        type='password'
                        mt="md"
                        value={password}
                        onChange={handlePasswordChange}
                        error={error && !isPasswordValid}
                    />
                    <Group justify="space-between"  mt="lg">
                        <Checkbox label="Remember me" />
                        <Anchor component="button" size="sm" onClick={() => router.push('/forgot-password')}>
                            Forgot password?
                        </Anchor>
                    </Group>
                    <Button type="submit" fullWidth mt="xl" disabled={loading}>
                        Sign in
                        {loading ? <Loader size="sm" /> : 'Sign in'}
                    </Button>
                    {error && <Text color="red" size="sm" mt="sm">{error}</Text>}
                </form>
            </Paper>
        </Container>
    );
}
