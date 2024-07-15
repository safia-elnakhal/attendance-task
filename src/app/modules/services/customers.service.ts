import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private baseUrl='http://localhost:3000';

  constructor(private _HttpClient:HttpClient) { }

  getAllCustomers(param:any):Observable<any>{
    return this._HttpClient.get(`${this.baseUrl}/customers`,{params:param})
  }
  getAllTransactions():Observable<any>{
    return this._HttpClient.get(`${this.baseUrl}/transactions`)
  }
}
