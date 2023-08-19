import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

@Component({
  selector: 'app-html-to-pdfmake',
  templateUrl: './html-to-pdfmake.component.html',
  styleUrls: ['./html-to-pdfmake.component.scss']
})
export class HtmlToPdfmakeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  title = 'htmltopdf';
   
  @ViewChild('pdfTable') pdfTable: ElementRef;
   
  public downloadAsPDF() {
    
    const pdfTable = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).open(); 
      
  }

}
