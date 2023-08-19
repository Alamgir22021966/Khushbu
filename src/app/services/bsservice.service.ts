import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// import { ThemeService } from 'ng2-charts';

const INIT_DATA = [];

@Injectable({
  providedIn: 'root'
})
export class BSserviceService {

  private bsMessage = new BehaviorSubject<string>('Testing Behavior Subject');
  public broadCast: Observable<any> = this.bsMessage.asObservable();

  constructor() { }

  UpdateBroadCast(NewMessage:string){
    this.bsMessage.next(NewMessage);
  }
}
