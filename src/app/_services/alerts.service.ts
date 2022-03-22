import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Alert } from '../_models/alert.model';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  // url = environment.apiURL;
  url = environment.dbURL;

  constructor(
    private http: HttpClient,
  ) { }

  getAlerts(): Observable<Alert[]> {
    return this.http.get(this.url + 'Alerts.json')
    .pipe(
      map(res => {
        const alerts = [];
        for(const key in res){
          alerts.push({...res[key], id: key});
        }
        return alerts;
      })
    )
  }

  deleteAlert(id){
    return this.http.delete(this.url + 'Alerts/' + id + '.json');
  }

  sendAlert(title: string, message: string): Observable<any> {
    const data = {
      title,
      message,
      timestamp: new Date()
    };

    return this.http.post(this.url + 'Alerts.json', data);
  }

}
