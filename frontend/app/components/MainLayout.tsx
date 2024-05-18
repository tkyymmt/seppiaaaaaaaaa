import { AppShell, Burger, Group, NavLink, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const navItems = [
    { link: '/clients', label: '顧客', },
    { link: '/client_categories', label: '顧客カテゴリ', },
];

export default function Header({
    children,
}: {
    children: React.ReactNode
}) {
    const [opened, { toggle }] = useDisclosure();
    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Title >Seppia課題</Title>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                {navItems.map((navItem, index) => (
                    <NavLink key={index} h={28} mt="sm"
                        href={navItem.link}
                        label={navItem.label}
                    />
                ))}
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    )
}
