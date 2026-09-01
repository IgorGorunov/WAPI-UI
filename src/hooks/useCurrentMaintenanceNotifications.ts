import { useEffect, useState } from 'react';
import { getMaintenanceNotifications } from '@/sanity/sanity-utils';
import { rigaTimeToUtcMs } from '@/utils/rigaTime';

export function useCurrentMaintenanceNotifications(): string | null {
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            const items = await getMaintenanceNotifications();

            const check = () => {
                const nowUtc = Date.now();
                const active = items.find(item => {
                    if (!item.dateStart || !item.dateEnd || !item.messageCurrent) return false;
                    const start = rigaTimeToUtcMs(item.dateStart);
                    const end = rigaTimeToUtcMs(item.dateEnd);
                    return nowUtc >= start && nowUtc <= end;
                });
                setMessage(active?.messageCurrent ?? null);
            };

            check();
            const interval = setInterval(check, 30_000);
            return () => clearInterval(interval);
        }

        load();
    }, []);

    return message;
}
