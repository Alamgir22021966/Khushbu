
export class CategoryModel {
    CategoryID: string;
    Category: string;
}


export class SubCategoryModel {
    CategoryID: string;
    SubCategoryID: number;
    SubCategory: string;
}

export class Category{   
    CategoryModel: CategoryModel;
    SubCategoryModel: SubCategoryModel[];
   
 }

 export class SubCategoryList {
    SubCategoryID: number;
    SubCategory: string;
}