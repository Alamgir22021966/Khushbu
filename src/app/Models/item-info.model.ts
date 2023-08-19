export class ItemCategory {

    CategoryID: string;
    SubCategoryID: number;
  
 }
 
 export class ItemInfo {
    CategoryID: number;
    SubCategoryID: number;
    ItemID: number;
    ProductName: string;
    RetailPrice: number;
    MinStock: number;
 } 
 
 export class ItemInfoModel{   
    ItemCategory: ItemCategory;
    ItemInfo: ItemInfo[];
   
 }

 export class ItemList {
   ItemID: number;
   ProductName: string;
   RetailPrice: number;
   MinStock: number;
} 