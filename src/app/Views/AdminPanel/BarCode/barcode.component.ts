import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PdfmakeService } from '@services/PDFMake/pdfmake.service';
import { SalesService } from '@services/sales.service';

// import * as pdfMake from 'pdfmake/build/pdfmake';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.scss']
})
export class BarcodeComponent implements OnInit {

  BarcodeForm: FormGroup;
  submitted = false;
  public Category: any = [];
  public SubCategory = [];
  public Items: any = [];
  public retailprice;

  constructor(
    private fb: FormBuilder,
    private salesService: SalesService,
    private pdfService: PdfmakeService
    ) {
    this.CreateBarcodeForm();

  }
  //--------------------------
  elementType = 'svg';
  value = 'ICICLTCORP12340987';
  //value = this.BarcodeForm.controls['BarcodeForm'].get('CategoryID').value > 0 ? 1: 'ICICLTCORP12340987' ;
  format = 'CODE128';
  lineColor = '#000000';
  width = 1;
  height = 30;
  displayValue = true;
  fontOptions = '';
  font = 'monospace';
  textAlign = 'center';
  textPosition = 'bottom';
  textMargin = 2;
  fontSize = 12;
  background = '#ffffff';
  margin = 50;
  marginTop = 1;
  marginBottom = 2;
  marginLeft = 50;
  marginRight = 10;
  //--------------------------

  get values(): string[] {

    return this.value.split('\n');
    //console.log( this.value.split('\n'));
  }

  CreateBarcodeForm() {

    let BC = [];
    for (let i = 0; i < 5; i++) {
      BC.push(this.Barcode())

    }
    this.BarcodeForm = this.fb.group({
      BarcodeParameter: this.fb.group({
        CategoryID: [''],
        SubCategoryID: [''],
        ItemID: [''],
        DisplayValue: ['true'],
        Quantity: [''],

      }),
      Barcodes: this.fb.array(BC) as FormArray,


    });
  }
  Barcode(): FormGroup {
    return this.fb.group({
      Barcode: [''],
    });
  }

  get BarcodeParameter() { return this.BarcodeForm.get('BarcodeParameter'); }

  get Barcodes() {
    return this.BarcodeForm.get('Barcodes') as FormArray;
  }

  ngOnInit(): void {
    this.GetCategory();

    this.BarcodeParameter.get('CategoryID').valueChanges.subscribe(
      (val: any) => {
        if (val == 'All') {
          this.BarcodeParameter.get('SubCategoryID').reset();
          this.BarcodeParameter.get('ItemID').reset();
        }
        else {
          this.BarcodeParameter.get('SubCategoryID').reset();
          this.GetSubCategory(val);
        }


      });

    this.BarcodeParameter.get('SubCategoryID').valueChanges.subscribe(
      () => {
        if (this.BarcodeParameter.get('SubCategoryID').value != null) {
          this.BarcodeParameter.get('ItemID').reset();
          // if (val == 0) {
          //   this.BarcodeParameter.get('ItemID').reset();
          // }
        }


      });

    this.BarcodeParameter.get('ItemID').valueChanges.subscribe(
      (val: any) => {
        if (this.BarcodeParameter.get('SubCategoryID').value != null && this.BarcodeParameter.get('ItemID').value != null) {
          this.GetRetailPrice(val);
        }
      });

  }


  public onOpen() {
    this.Category.push({ Name: 'All', Value: null });
  }

  public onClose() {
    this.Category.push({ Name: '(close)', Value: null });
  }

  public onFocus($event: Event) {
    this.Category.push({ Name: '(focus)', Value: $event });
  }

  public onSearch($event) {
    this.Category.push({ Name: '(search)', Value: $event });
  }

  public GetCategory(): void {

    this.salesService.GetCategory().subscribe(
      data => {

        this.Category = data;
        this.Category.unshift({ Name: 'All', Value: "All" });

      },
      (err: any) => {
        console.log(err);
      });
  }

  public GetSubCategory(CategoryID: any): void {
    if (CategoryID) {
      this.salesService.GetSubCategory(CategoryID).subscribe(
        data => {

          this.SubCategory = data;
          this.SubCategory.unshift({ Name: 'All', Value: "0" });

        },
        (err: any) => {
          console.log(err);
        });
    }
  }



  public GetProductName(CategoryID: any, SubCategoryID: any): void {

    if (CategoryID && SubCategoryID) {
      this.salesService.GetProductName(CategoryID, SubCategoryID).subscribe(
        data => {

          this.Items = data;
          this.Items.unshift({ Name: 'All', Value: "0" });
        },
        (err: any) => {
          console.log(err);
        });

    }
  }

  public GetRetailPrice(itemid): void {

    if (this.BarcodeParameter.get('CategoryID').value) {
      this.salesService.GetRetailPrice(this.BarcodeParameter.get('CategoryID').value, this.BarcodeParameter.get('SubCategoryID').value, itemid).subscribe(
        data => {

          this.retailprice = data;
          //console.log(this.retailprice);
        })

    }
  }

  Cancel() {
    this.BarcodeForm.reset();
    for (let i = this.Barcodes.length; i >= 0; i--) {
      this.Barcodes.removeAt(i);
    }
  }

  BarCode() {

    for (let i = 0; i < (this.BarcodeParameter.get('Quantity').value); i++) {
      this.Barcodes.push(this.Barcode());

    }

    this.value = 'Khushbu' + this.BarcodeParameter.get('CategoryID').value
      + '00' + this.BarcodeParameter.get('SubCategoryID').value
      + '000' + this.BarcodeParameter.get('ItemID').value
      + this.retailprice

    this.displayValue = this.BarcodeParameter.get('DisplayValue').value;

  }


  public async GeneratePDF(action = 'open') {

    await this.pdfService.loadPdfMaker();

    //const documentDefinition = this.getDocumentDefinition();
    const documentDefinition = { content: 'This is an sample PDF printed with pdfMake' };
    switch (action) {
      case 'open': this.pdfService.pdfMake.createPdf(documentDefinition).open(); break;
      // case 'open': pdfMake.createPdf(documentDefinition).open({}, window); break;
      case 'print': this.pdfService.pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': this.pdfService.pdfMake.createPdf(documentDefinition).download(); break;
      default: this.pdfService.pdfMake.createPdf(documentDefinition).open(); break;
    }

  }



  getColor(country: any) {
    switch (country) {
      case 'UK':
        return 'green';
      case 'USA':
        return 'blue';
      case 'HK':
        return 'red';
    }
  }

}
