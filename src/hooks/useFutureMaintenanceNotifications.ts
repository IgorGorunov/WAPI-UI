import { useEffect, useState } from 'react';
import { getMaintenanceNotifications } from '@/sanity/sanity-utils';
import { rigaTimeToUtcMs } from '@/utils/rigaTime';

export function useFutureMaintenanceNotifications(): string[] {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        async function load() {
            const items = await getMaintenanceNotifications();

            const nowUtc = Date.now();

            const upcomingMessages = items
                .filter(item => {
                    if (!item.dateStart) return false;
                    return rigaTimeToUtcMs(item.dateStart) > nowUtc;
                })
                .sort((a, b) => rigaTimeToUtcMs(a.dateStart) - rigaTimeToUtcMs(b.dateStart))
                .map(item => item.messageFuture)
                .filter(Boolean);

            console.log('time now: ', nowUtc, items, upcomingMessages)
            setMessages(upcomingMessages);
        }

        load();
    }, []);

    return messages;
}
