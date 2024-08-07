import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PdfViewerModule, PDFDocumentProxy, PDFPageProxy } from 'ng2-pdf-viewer';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DropboxSignService } from '../dropbox-sign.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css'],
  standalone: true,
  imports: [PdfViewerModule, CommonModule, ReactiveFormsModule, MatButtonModule]
})
export class PdfViewerComponent {
  pdfSrc: string | Uint8Array | null = null;
  form: FormGroup;
  coordinates = { x: 0, y: 0 };
  currentPage = 1;
  pageViewport: any = null;
  pdf: PDFDocumentProxy | null = null;
  pdfViewerElement: HTMLElement | null = null;
  fieldTypes = [
    "text",             // A text input field
    "checkbox",         // A yes/no checkbox
    "date_signed",      // A date when a document was signed
    "dropdown",         // An input field for dropdowns
    "initials",         // An input field for initials
    "signature",        // A signature input field
    "text-merge",       // A text field that has default text set by the API
    "checkbox-merge"    // A checkbox field that has default value set by the API
  ];
  selectedFile: File | null = null;
  formFields: any[] = [];
  fieldCounter = 0; // Counter to ensure unique API IDs
  submissionResult: any = null;

  constructor(
    private fb: FormBuilder,
    private dropboxSignService: DropboxSignService,
    public dialogRef: MatDialogRef<PdfViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      signerName: [''],
      signerEmail: [''],
      title: [''],
      subject: [''],
      message: [''],
      enableSms: [false],
      phoneNumber: [''],
      fieldType: [this.fieldTypes[0]],
      fieldWidth: ['100'],
      fieldHeight: ['16'],
      fieldPage: ['1'],
      fieldPlaceholder: ['Placeholder']
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const arrayBuffer = fileReader.result as ArrayBuffer;
        this.pdfSrc = new Uint8Array(arrayBuffer);
        this.selectedFile = file; // Save the selected file
      };
      fileReader.readAsArrayBuffer(file);
    }
  }

  onPdfClick(event: MouseEvent): void {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.coordinates.x = event.clientX - rect.left;
    this.coordinates.y = event.clientY - rect.top;
    console.log(`Coordinates: X: ${this.coordinates.x}, Y: ${this.coordinates.y}`);
  }

  onPdfLoaded(pdf: PDFDocumentProxy): void {
    this.pdf = pdf;
    this.loadPage(1); // Load the first page initially
  }

  onPageRendered(event: CustomEvent): void {
    const page = event.detail.page as PDFPageProxy;
    this.pageViewport = page.getViewport({ scale: 1 });
  }

  loadPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    if (this.pdf) {
      this.pdf.getPage(pageNumber).then((page: PDFPageProxy) => {
        this.pageViewport = page.getViewport({ scale: 1 });
        this.pdfViewerElement = document.querySelector('.pdf-viewer-container') as HTMLElement;
      });
    }
  }

  addField(): void {
    this.fieldCounter++;
    const field = {
      api_id: `field${this.fieldCounter}`,
      name: this.form.get('fieldPlaceholder')?.value,
      type: this.form.get('fieldType')?.value,
      x: this.coordinates.x,
      y: this.coordinates.y,
      width: this.form.get('fieldWidth')?.value,
      height: this.form.get('fieldHeight')?.value,
      page: this.currentPage,
      required: true,
      signer: 0
    };
    this.formFields.push(field);
    console.log('Field added:', field);
  }

  sendSignatureRequest(): void {
    const formData = new FormData();
    formData.append('title', this.form.get('title')?.value);
    formData.append('subject', this.form.get('subject')?.value);
    formData.append('message', this.form.get('message')?.value);
    formData.append('signers[0][email_address]', this.form.get('signerEmail')?.value);
    formData.append('signers[0][name]', this.form.get('signerName')?.value);
    formData.append('signers[0][order]', '0');
    formData.append('test_mode', '1'); // Set test mode to 1

    if (this.form.get('enableSms')?.value) {
      formData.append('signers[0][sms_phone_number]', this.form.get('phoneNumber')?.value);
    }

    if (this.selectedFile) {
      formData.append('files[0]', this.selectedFile);

      // Add form fields
      formData.append('form_fields_per_document', JSON.stringify([this.formFields]));

      this.dropboxSignService.sendSignatureRequest(formData).subscribe(
        response => {
          console.log('Signature request sent successfully:', response);
          this.submissionResult = response;
        },
        error => {
          console.error('Error sending signature request:', error);
          this.submissionResult = error;
        }
      );
    } else {
      console.error('No file selected');
    }
  }
}
