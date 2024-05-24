'use client';

import { Provider } from 'urql';
import {hasuraClient} from './lib/urql';

export function Providers({ children }: { children: React.ReactNode }) {
    return  (
        // FIXME: hasuraClientとnestjsClientをどうやって動的に切り替える？
        <Provider value={hasuraClient}>
        {/* <Provider value={nestjsClient}> */}
            {children}
        </Provider>
    );
}
