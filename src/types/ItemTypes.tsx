import { ItemCategory } from "./ItemCategoryTypes";
import { ItemModel } from "./ItemModelTypes";
import { UOM } from "./uomtypes";


export interface ItemType {
  _id?: string;  
  hsnCode: string;
  internalPartNo: string;
  externalPartNo: string;
  partName: string;
  model?: ItemModel | string;  
  category?: ItemCategory | string;  
  uom?: UOM | string;  
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
}

export interface ApiResponse<T> {
  error?: string;
  data?: T;
}
