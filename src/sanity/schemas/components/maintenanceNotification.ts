import {MdOutlineBuildCircle} from "react-icons/md";

const maintenanceNotification = {
    name: 'maintenanceNotification',
    title: 'Maintenance notification',
    type: 'document',
    icon: MdOutlineBuildCircle,
    fields: [
        {
            name: 'title',
            title: 'Title to identify the message',
            type: 'string',
            description: 'Title for technical use. Should contain date of maintenance',
            validation: Rule => Rule.required().error('Title is required')
        },
        {
            name: 'messageFuture',
            title: 'Message for scheduled maintenance',
            type: 'string',
            description: 'Message for scheduled (future) maintenance on Dashboard page.',
            validation: Rule => Rule.required().error('Message is required')
        },
        {
            name: 'messageCurrent',
            title: 'Message for current maintenance',
            type: 'string',
            description: 'Message for when the maintenance in underway (on Login page).',
            validation: Rule => Rule.required().error('Message is required')
        },
        {
            name: 'dateStart',
            title: 'Maintenance start — Riga time (Europe/Riga)',
            type: 'string',
            
            description: 'Enter as DD.MM.YYYY HH:mm — in Riga time (Europe/Riga). Example: 06.09.2026 09:00',
            initialValue: () => {
                const now = new Date();
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                return `${day}.${month}.${year} 12:00`;
            },
            validation: Rule => Rule.required()
                .regex(/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/, { name: 'datetime', invert: false })
                .error('Required. Format: DD.MM.YYYY HH:mm (e.g. 06.09.2026 20:00)')
        },
        {
            name: 'dateEnd',
            title: 'Maintenance end — Riga time (Europe/Riga)',
            type: 'string',
            description: 'Enter as DD.MM.YYYY HH:mm — in Riga time. Example: 06.09.2026 17:00',
            initialValue: () => {
                const now = new Date();
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                return `${day}.${month}.${year} 20:00`;
            },
            validation: Rule => Rule.required()
                .regex(/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/, { name: 'datetime', invert: false })
                .error('Required. Format: DD.MM.YYYY HH:mm (e.g. 06.09.2026 17:00)')
        },
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'messageFuture',
        },
        prepare(selection: { title: string; subtitle: string }) {
            return {
                title: `${selection.title}`,
                subtitle: `Maintenance message`
            };
        }
    }
};

export default maintenanceNotification;