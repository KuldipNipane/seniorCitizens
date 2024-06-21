import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CrudServiceService {

  // private apiUrl = 'https://localhost:7104/api/v1/hisc';
  http = inject(HttpClient)
  apipath: any;
  getData(): Observable<any> {
    return this.http.get<any>(environment.apipath).pipe(catchError(this.handleError));
  }

  postData(data: FormData, id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Accept': 'text/plain' }); // Set Accept header to 'text/plain'
    return this.http.post<any>(`${environment.apipath}?id=${id}`, data, { headers, responseType: 'text' as 'json' }).pipe(
      catchError(this.handleError)
    );
  }
  getDataById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apipath}?id=${id}`).pipe(
      catchError(this.handleError)
    );
  }
  // Delete data
  deleteData(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apipath}?id=${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
