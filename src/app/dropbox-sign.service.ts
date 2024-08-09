import { Injectable } from '@angular/core';  // Import Injectable decorator to define a service
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';  // Import HttpClient, HttpHeaders, and HttpParams for HTTP requests
import { Observable } from 'rxjs';  // Import Observable for handling asynchronous data streams
import { environment } from '../environments/environment';  // Import environment configuration for API details

@Injectable({
  providedIn: 'root',  // The service is provided at the root level, making it available application-wide
})
export class DropboxSignService {
  private apiUrl = environment.apiUrl;  // Base URL for Dropbox Sign API, from environment configuration
  private apiKey = environment.apiKey;  // API key for authentication, from environment configuration
  private clientId = environment.clientId;  // Client ID for embedded signing, from environment configuration

  constructor(private http: HttpClient) {}  // Inject HttpClient to perform HTTP requests

  // Helper method to create HTTP headers with the appropriate content type and authorization
  private getHeaders(contentType: string = 'application/json'): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Basic ${btoa(this.apiKey + ':')}`,  // Base64-encoded API key for Basic Auth
      'Content-Type': contentType,  // Content-Type header, defaulting to 'application/json'
    });
  }

  // Method to get account details based on email
  getAccount(email: string): Observable<any> {
    const headers = this.getHeaders();  // Create headers using the helper method
    const params = new HttpParams().set('email_address', email);  // Set email as a query parameter
    return this.http.get(`${this.apiUrl}/account`, { headers, params });  // Perform GET request to retrieve account details
  }

  // Method to create a new account with the provided email
  createAccount(email: string): Observable<any> {
    const headers = this.getHeaders('application/x-www-form-urlencoded');  // Create headers with form-urlencoded content type
    const body = new URLSearchParams();  // Create URLSearchParams for form data
    body.set('email_address', email);  // Set email in the form data
    return this.http.post(`${this.apiUrl}/account/create`, body.toString(), { headers });  // Perform POST request to create account
  }

  // Method to verify an account with the provided email
  verifyAccount(email: string): Observable<any> {
    const headers = this.getHeaders('application/x-www-form-urlencoded');  // Create headers with form-urlencoded content type
    const body = new URLSearchParams();  // Create URLSearchParams for form data
    body.set('email_address', email);  // Set email in the form data
    return this.http.post(`${this.apiUrl}/account/verify`, body.toString(), { headers });  // Perform POST request to verify account
  }

  // Method to update account details with a callback URL and locale
  updateAccount(callbackUrl: string, locale: string): Observable<any> {
    const headers = this.getHeaders();  // Create headers using the helper method
    const formData: FormData = new FormData();  // Create FormData for multipart form data
    formData.append('callback_url', callbackUrl);  // Append callback URL to form data
    formData.append('locale', locale);  // Append locale to form data

    return this.http.put(`${this.apiUrl}/account`, formData, { headers });  // Perform PUT request to update account
  }

  // Method to send a signature request with the provided FormData
  sendSignatureRequest(data: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Basic ${btoa(this.apiKey + ':')}`  // Create headers with Basic Auth for multipart form data
    });
    return this.http.post(`${this.apiUrl}/signature_request/send`, data, { headers });  // Perform POST request to send signature request
  }

  // Method to send a signature request using text tags
  sendSignatureRequestWithTextTags(data: FormData): Observable<any> {
    const headers = this.getHeaders('multipart/form-data');  // Create headers with multipart/form-data content type
    return this.http.post(`${this.apiUrl}/signature_request/send_with_text_tags`, data, { headers });  // Perform POST request to send signature request with text tags
  }

  // Method to send a simple signature request
  sendSimpleSignatureRequest(data: FormData): Observable<any> {
    const headers = this.getHeaders('multipart/form-data');  // Create headers with multipart/form-data content type
    return this.http.post(`${this.apiUrl}/signature_request/send_simple`, data, { headers });  // Perform POST request to send simple signature request
  }

  // Method to update an existing signature request
  updateSignatureRequest(signatureRequestId: string, data: FormData): Observable<any> {
    const headers = this.getHeaders('multipart/form-data');  // Create headers with multipart/form-data content type
    return this.http.put(`${this.apiUrl}/signature_request/${signatureRequestId}`, data, { headers });  // Perform PUT request to update signature request
  }

  // Method to cancel an incomplete signature request
  cancelIncompleteSignatureRequest(signatureRequestId: string): Observable<any> {
    const headers = this.getHeaders();  // Create headers using the helper method
    return this.http.post(`${this.apiUrl}/signature_request/cancel/${signatureRequestId}`, null, { headers });  // Perform POST request to cancel incomplete signature request
  }

  // Method to remove access to a signature request
  removeSignatureRequestAccess(signatureRequestId: string): Observable<any> {
    const headers = this.getHeaders();  // Create headers using the helper method
    return this.http.post(`${this.apiUrl}/signature_request/remove/${signatureRequestId}`, null, { headers });  // Perform POST request to remove signature request access
  }

  // Method to get details of a specific signature request
  getSignatureRequest(signatureRequestId: string): Observable<any> {
    const headers = this.getHeaders();  // Create headers using the helper method
    return this.http.get(`${this.apiUrl}/signature_request/${signatureRequestId}`, { headers });  // Perform GET request to retrieve signature request details
  }

  // Method to list all signature requests
  listSignatureRequests(): Observable<any> {
    const headers = this.getHeaders();  // Create headers using the helper method
    return this.http.get(`${this.apiUrl}/signature_request/list`, { headers });  // Perform GET request to list signature requests
  }

  // Method to download files associated with a signature request
  downloadFiles(signatureRequestId: string, fileType: 'pdf' | 'zip'): Observable<any> {
    const headers = this.getHeaders();  // Create headers using the helper method
    const params = new HttpParams().set('file_type', fileType);  // Set file type as a query parameter
    return this.http.get(`${this.apiUrl}/signature_request/files/${signatureRequestId}`, { headers, params, responseType: 'blob' });  // Perform GET request to download files as a blob
  }

  // Method to download files as a data URI
  downloadFilesAsUri(signatureRequestId: string): Observable<any> {
    const headers = this.getHeaders();  // Create headers using the helper method
    return this.http.get(`${this.apiUrl}/signature_request/files_as_data_uri/${signatureRequestId}`, { headers });  // Perform GET request to download files as a data URI
  }

  // Method to download files as a file URL
  downloadFilesAsFileUrl(signatureRequestId: string): Observable<any> {
    const headers = this.getHeaders();  // Create headers using the helper method
    return this.http.get(`${this.apiUrl}/signature_request/files_as_file_url/${signatureRequestId}`, { headers });  // Perform GET request to download files as a file URL
  }

  // Method to create an embedded signature request
  createEmbeddedSignatureRequest(data: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Basic ${btoa(this.apiKey + ':')}`  // Create headers with Basic Auth for multipart form data
    });
    return this.http.post(`${this.apiUrl}/signature_request/create_embedded`, data, { headers });  // Perform POST request to create embedded signature request
  }

  // Method to create an embedded signature request using a template
  createEmbeddedSignatureRequestWithTemplate(data: FormData): Observable<any> {
    const headers = this.getHeaders('multipart/form-data');  // Create headers with multipart/form-data content type
    return this.http.post(`${this.apiUrl}/signature_request/create_embedded_with_template`, data, { headers });  // Perform POST request to create embedded signature request with template
  }

  // Method to get the embedded sign URL for a specific signature ID
  getEmbeddedSignUrl(signId: string): Observable<any> {
    const headers = this.getHeaders();  // Create headers using the helper method
    return this.http.get(`${this.apiUrl}/embedded/sign_url/${signId}`, { headers });  // Perform GET request to retrieve embedded sign URL
  }

  // Method to get the embedded template edit URL for a specific template ID
  getEmbeddedTemplateEditUrl(templateId: string): Observable<any> {
    const headers = this.getHeaders();  // Create headers using the helper method
    return this.http.get(`${this.apiUrl}/embedded/edit_url/${templateId}`, { headers });  // Perform GET request to retrieve embedded template edit URL
  }
}
