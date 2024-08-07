import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DropboxSignService {
  private apiUrl = environment.apiUrl;
  private apiKey = environment.apiKey;
  private clientId = environment.clientId;

  constructor(private http: HttpClient) {}

  private getHeaders(contentType: string = 'application/json'): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Basic ${btoa(this.apiKey + ':')}`,
      'Content-Type': contentType,
    });
  }

  // Existing methods
  getAccount(email: string): Observable<any> {
    const headers = this.getHeaders();
    const params = new HttpParams().set('email_address', email);
    return this.http.get(`${this.apiUrl}/account`, { headers, params });
  }

  createAccount(email: string): Observable<any> {
    const headers = this.getHeaders('application/x-www-form-urlencoded');
    const body = new URLSearchParams();
    body.set('email_address', email);
    return this.http.post(`${this.apiUrl}/account/create`, body.toString(), { headers });
  }

  verifyAccount(email: string): Observable<any> {
    const headers = this.getHeaders('application/x-www-form-urlencoded');
    const body = new URLSearchParams();
    body.set('email_address', email);
    return this.http.post(`${this.apiUrl}/account/verify`, body.toString(), { headers });
  }

  updateAccount(callbackUrl: string, locale: string): Observable<any> {
    const headers = this.getHeaders();
    const formData: FormData = new FormData();
    formData.append('callback_url', callbackUrl);
    formData.append('locale', locale);

    return this.http.put(`${this.apiUrl}/account`, formData, { headers });
  }

  // Signature request methods
  sendSignatureRequest(data: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Basic ${btoa(this.apiKey + ':')}`
    });
    return this.http.post(`${this.apiUrl}/signature_request/send`, data, { headers });
  }

  sendSignatureRequestWithTextTags(data: FormData): Observable<any> {
    const headers = this.getHeaders('multipart/form-data');
    return this.http.post(`${this.apiUrl}/signature_request/send_with_text_tags`, data, { headers });
  }

  sendSimpleSignatureRequest(data: FormData): Observable<any> {
    const headers = this.getHeaders('multipart/form-data');
    return this.http.post(`${this.apiUrl}/signature_request/send_simple`, data, { headers });
  }

  updateSignatureRequest(signatureRequestId: string, data: FormData): Observable<any> {
    const headers = this.getHeaders('multipart/form-data');
    return this.http.put(`${this.apiUrl}/signature_request/${signatureRequestId}`, data, { headers });
  }

  cancelIncompleteSignatureRequest(signatureRequestId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/signature_request/cancel/${signatureRequestId}`, null, { headers });
  }

  removeSignatureRequestAccess(signatureRequestId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/signature_request/remove/${signatureRequestId}`, null, { headers });
  }

  getSignatureRequest(signatureRequestId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/signature_request/${signatureRequestId}`, { headers });
  }

  listSignatureRequests(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/signature_request/list`, { headers });
  }

  downloadFiles(signatureRequestId: string, fileType: 'pdf' | 'zip'): Observable<any> {
    const headers = this.getHeaders();
    const params = new HttpParams().set('file_type', fileType);
    return this.http.get(`${this.apiUrl}/signature_request/files/${signatureRequestId}`, { headers, params, responseType: 'blob' });
  }

  downloadFilesAsUri(signatureRequestId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/signature_request/files_as_data_uri/${signatureRequestId}`, { headers });
  }

  downloadFilesAsFileUrl(signatureRequestId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/signature_request/files_as_file_url/${signatureRequestId}`, { headers });
  }

  createEmbeddedSignatureRequest(data: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Basic ${btoa(this.apiKey + ':')}`
    });
    return this.http.post(`${this.apiUrl}/signature_request/create_embedded`, data, { headers });
  }

  createEmbeddedSignatureRequestWithTemplate(data: FormData): Observable<any> {
    const headers = this.getHeaders('multipart/form-data');
    return this.http.post(`${this.apiUrl}/signature_request/create_embedded_with_template`, data, { headers });
  }

  getEmbeddedSignUrl(signId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/embedded/sign_url/${signId}`, { headers });
  }

  getEmbeddedTemplateEditUrl(templateId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/embedded/edit_url/${templateId}`, { headers });
  }
}
