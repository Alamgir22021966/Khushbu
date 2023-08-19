export class SalesInfo {
   InvoiceNumber: string;
    CustomerID: string;
    SalesDate: Date;
    SalesBy: string;
    DiscountAmount: number;
    DiscountPercentage: number;
    Outlet: string;
    ModeofPayment: string;
 }
 
 
 export class SalesDetails {
 
   InvoiceNumber: string;
    Slno: number;
    CategoryID: string;
    SubCategoryID: number;
    ItemID: number;
    Quantity: number;
    UnitPrice: number;
    TotalPrice: number;
   
 } 
 
 export class SalesModel{   
    SalesInfo: SalesInfo;
    SalesDetails: SalesDetails[];
   
 }


 export class SalesDetail {
    CategoryID: string;
    SubCategoryID: number;
    ItemID: number;
    Quantity: number;
    UnitPrice: number;
    TotalPrice: number;
   
 } 