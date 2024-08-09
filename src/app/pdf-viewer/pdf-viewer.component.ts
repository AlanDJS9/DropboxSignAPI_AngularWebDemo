import { Component } from '@angular/core';  // Import Angular core components and decorators
import { FormBuilder, FormGroup } from '@angular/forms';  // Import FormBuilder and FormGroup for reactive forms
import { PdfViewerModule, PDFDocumentProxy, PDFPageProxy } from 'ng2-pdf-viewer';  // Import PDF viewer module and types
import { CommonModule } from '@angular/common';  // Import CommonModule for common Angular directives
import { ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule for reactive form functionality
import { DropboxSignService } from '../dropbox-sign.service';  // Import custom service for Dropbox Sign API
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';  // Import Material dialog references and data token
import { Inject } from '@angular/core';  // Import Inject decorator for dependency injection
import { MatButtonModule } from '@angular/material/button';  // Import Material Button module

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',  // Template file for the component's view
  styleUrls: ['./pdf-viewer.component.css'],  // Stylesheet file for the component's styles
  standalone: true,  // Indicates this component is standalone and doesn't need to be declared in an NgModule
  imports: [
    PdfViewerModule,  // Module to display PDF files
    CommonModule,  // Common Angular directives (e.g., ngIf, ngFor)
    ReactiveFormsModule,  // Provides reactive form functionality
    MatButtonModule  // Material Design button control
  ]
})
export class PdfViewerComponent {
  pdfSrc: string | Uint8Array | null = null;  // Variable to hold the PDF source
  form: FormGroup;  // FormGroup instance to manage the form's data and validation
  coordinates = { x: 0, y: 0 };  // Object to store the coordinates of the clicked position on the PDF
  currentPage = 1;  // Variable to keep track of the current page in the PDF
  pageViewport: any = null;  // Variable to store the viewport of the current page
  pdf: PDFDocumentProxy | null = null;  // Variable to store the loaded PDF document
  pdfViewerElement: HTMLElement | null = null;  // Reference to the PDF viewer container element
  fieldTypes = [  // Array of field types available for form fields
    "text",             // A text input field
    "checkbox",         // A yes/no checkbox
    "date_signed",      // A date when a document was signed
    "dropdown",         // An input field for dropdowns
    "initials",         // An input field for initials
    "signature",        // A signature input field
    "text-merge",       // A text field that has default text set by the API
    "checkbox-merge"    // A checkbox field that has default value set by the API
  ];
  selectedFile: File | null = null;  // Variable to store the selected PDF file
  formFields: any[] = [];  // Array to store form fields added to the PDF
  fieldCounter = 0;  // Counter to ensure unique API IDs for fields
  submissionResult: any = null;  // Variable to store the result of the signature request submission

  constructor(
    private fb: FormBuilder,  // Inject FormBuilder to create the form group
    private dropboxSignService: DropboxSignService,  // Inject DropboxSignService to handle API requests
    public dialogRef: MatDialogRef<PdfViewerComponent>,  // Inject the reference to the dialog
    @Inject(MAT_DIALOG_DATA) public data: any  // Inject the data passed to the dialog
  ) {
    // Initialize the form with required fields and their default values
    this.form = this.fb.group({
      signerName: [''],  // Name of the signer
      signerEmail: [''],  // Email of the signer
      title: [''],  // Title of the signature request
      subject: [''],  // Subject of the signature request
      message: [''],  // Message to the signer
      enableSms: [false],  // Toggle for enabling SMS notifications
      phoneNumber: [''],  // Phone number for SMS notification
      fieldType: [this.fieldTypes[0]],  // Default field type
      fieldWidth: ['100'],  // Default field width
      fieldHeight: ['16'],  // Default field height
      fieldPage: ['1'],  // Default page number for the field
      fieldPlaceholder: ['Placeholder']  // Default placeholder text for the field
    });
  }

  // Method to handle file selection and load the PDF
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];  // Get the selected file
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const arrayBuffer = fileReader.result as ArrayBuffer;
        this.pdfSrc = new Uint8Array(arrayBuffer);  // Convert file to Uint8Array for PDF viewer
        this.selectedFile = file;  // Save the selected file
      };
      fileReader.readAsArrayBuffer(file);  // Read the file as an ArrayBuffer
    }
  }

  // Method to handle click events on the PDF to get coordinates
  onPdfClick(event: MouseEvent): void {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.coordinates.x = event.clientX - rect.left;  // Calculate X coordinate relative to PDF
    this.coordinates.y = event.clientY - rect.top;  // Calculate Y coordinate relative to PDF
    console.log(`Coordinates: X: ${this.coordinates.x}, Y: ${this.coordinates.y}`);
  }

  // Method to handle PDF load event
  onPdfLoaded(pdf: PDFDocumentProxy): void {
    this.pdf = pdf;  // Save the loaded PDF document
    this.loadPage(1);  // Load the first page initially
  }

  // Method to handle page render event and get the viewport
  onPageRendered(event: CustomEvent): void {
    const page = event.detail.page as PDFPageProxy;
    this.pageViewport = page.getViewport({ scale: 1 });  // Get the viewport of the rendered page
  }

  // Method to load a specific page in the PDF
  loadPage(pageNumber: number): void {
    this.currentPage = pageNumber;  // Set the current page number
    if (this.pdf) {
      this.pdf.getPage(pageNumber).then((page: PDFPageProxy) => {
        this.pageViewport = page.getViewport({ scale: 1 });  // Get the viewport for the page
        this.pdfViewerElement = document.querySelector('.pdf-viewer-container') as HTMLElement;
      });
    }
  }

  // Method to add a form field to the PDF at the clicked coordinates
  addField(): void {
    this.fieldCounter++;
    const field = {
      api_id: `field${this.fieldCounter}`,  // Generate a unique API ID for the field
      name: this.form.get('fieldPlaceholder')?.value,  // Get the placeholder name
      type: this.form.get('fieldType')?.value,  // Get the field type
      x: this.coordinates.x,  // X coordinate of the field
      y: this.coordinates.y,  // Y coordinate of the field
      width: this.form.get('fieldWidth')?.value,  // Field width
      height: this.form.get('fieldHeight')?.value,  // Field height
      page: this.currentPage,  // Page number where the field is placed
      required: true,  // Set the field as required
      signer: 0  // Signer index (0 for the first signer)
    };
    this.formFields.push(field);  // Add the field to the list of form fields
    console.log('Field added:', field);
  }

  // Method to send the signature request with the form fields
  sendSignatureRequest(): void {
    const formData = new FormData();  // Create a FormData object to hold form values
    formData.append('title', this.form.get('title')?.value);  // Append title to the form data
    formData.append('subject', this.form.get('subject')?.value);  // Append subject to the form data
    formData.append('message', this.form.get('message')?.value);  // Append message to the form data
    formData.append('signers[0][email_address]', this.form.get('signerEmail')?.value);  // Append signer email to the form data
    formData.append('signers[0][name]', this.form.get('signerName')?.value);  // Append signer name to the form data
    formData.append('signers[0][order]', '0');  // Append signer order (0 for the first signer)
    formData.append('test_mode', '1');  // Set test mode to 1

    if (this.form.get('enableSms')?.value) {
      formData.append('signers[0][sms_phone_number]', this.form.get('phoneNumber')?.value);  // Append SMS phone number if enabled
    }

    if (this.selectedFile) {
      formData.append('files[0]', this.selectedFile);  // Append the selected file to the form data

      // Add form fields as a JSON string
      formData.append('form_fields_per_document', JSON.stringify([this.formFields]));

      // Call the service to send the signature request
      this.dropboxSignService.sendSignatureRequest(formData).subscribe(
        response => {
          console.log('Signature request sent successfully:', response);
          this.submissionResult = response;  // Save the result of the submission
        },
        error => {
          console.error('Error sending signature request:', error);
          this.submissionResult = error;  // Save the error result
        }
      );
    } else {
      console.error('No file selected');  // Log an error if no file is selected
    }
  }
}
