'use client';

import { Provider } from 'urql';
import { hasuraClient } from './lib/urql';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider value={hasuraClient}>
            {children}
        </Provider>
    );
}
