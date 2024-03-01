import {AttachedFilesType} from "@/types/utility";

export type TicketType = {
    status: string;
    topic: string;
    subject: string;
    description: string;
    resolution: string;
    subjectUuid: string | null;
    uuid: string;
    tableKey: string;
}

export type TicketParamsType = {
    statuses: string[];
    topics: string[];
}

export type SingleTicketType = {
    canEdit: boolean;
    status: string;
    uuid: string;
    description: string;
    result: string;
    number: string;
    date: string;
    topic: string;
    subject: string;
    subjectType: string | null;
    subjectUuid: string | null;
    attachedFiles: AttachedFilesType[];
    supportManager: string;
}

export type ChatMessageType = {
    date: string;
    message: string;
    author: string;
    attachedFiles: AttachedFilesType[];
}