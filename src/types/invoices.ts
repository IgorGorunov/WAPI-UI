export type InvoiceType = {
    tableKey: string,
    status: string;
    uuid: string;
    number: string,
    date: string,
    dueDate: string,
    amount: number,
    currency: string,
    paid: number,
    debt: number,
    overdue: string,
    services: {
        service: string,
        quantity: number,
        price: number,
        amount: number,
    }[]
 }

 export type BalanceInfoType = {
    currency: string;
    debt?: number;
    overdue?: number;
    limit?: number;
 }

 export type InvoiceBalanceType = {
    debt?: BalanceInfoType[];
    overdue?: BalanceInfoType[];
    overdueLimit?: BalanceInfoType[];
 }