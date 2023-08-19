import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// import { ConfirmDialogComponent } from '../views/purchase/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  bsModalRef: BsModalRef;
  constructor(private bsModalService: BsModalService) { }

  confirm(title: string, message: string, options: string[]): Observable<string> {

    
    const initialState = {
      title: 'Category Information',
      label: 'Category ID',
      ControlName: 'CategoryID',
      answer: "",
      animated: true, 
      keyboard: true, 
      backdrop: true, 
      ignoreBackdropClick: false
    };

    // this.bsModalRef = this.bsModalService.show(ConfirmDialogComponent, { initialState });
    this.bsModalRef.content.okBtnName = 'Search';

    return new Observable<string>(this.getConfirmSubscriber());
  }

  private getConfirmSubscriber() {
    return (observer) => {
      const subscription = this.bsModalService.onHidden.subscribe((reason: string) => {
        observer.next(this.bsModalRef.content.answer);
        observer.complete();
      });

      return {
        unsubscribe() {
          subscription.unsubscribe();
        }
      };
    }
  }



}
