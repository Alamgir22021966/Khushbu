
export class PurchaseInfo {

   PID: string;
   Purchasedate: Date;
   VID: string;
   DiscountAmount: number;
   DiscountPercentage: number;
   OrderBy: string;
   InputBy: string;
   InputDate: Date;

}


export class PurchaseDetails {

   PID: string;
   Slno: number;
   CategoryID: string;
   SubCategoryID: number;
   ItemID: number;
   Quantity: number;
   UnitPrice: number;
   TotalPrice: number;

}


export class PurchaseModel {
   PurchaseInfo: PurchaseInfo;
   PurchaseDetails: PurchaseDetails[];

}

// export class PurchaseModel
// {
//   constructor(
//     public purchaseInfo: PurchaseInfo,
//     public purchaseDetails: PurchaseDetails[]
//   ) {}
// }

export class DropdownModel {
   constructor(
      public Name: string,
      public Value: string
   ) {

   }
}