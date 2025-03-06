export interface ItemType {
    _id?: string;
    hsnCode: string;
    internalPartNo: string;
    externalPartNo: string;
    partName: string;
    model: string | { _id: string; name: string };
    category: string | { _id: string; name: string };
    uom: string | { _id: string; name: string };
    packingQty: number;
    stockPerDay: number;
    safetyDays: number;
    minReqDay: number;
    maxReqDays: number;
    productionItem: boolean;
    sellingItem: boolean;
    purchaseItem: boolean;
    selfLife: number;
    expiryDays: number;
    scheduleNo: string;
    status?: string;
}

export interface ItemResponse {
    items: ItemType[];
    totalPages: number;
    total?: number;
} 