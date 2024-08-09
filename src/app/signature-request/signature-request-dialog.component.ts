import { Component, Inject } from '@angular/core';  // Import Angular core components and decorators
import {
  MatDialogRef,  // Reference to a dialog opened via MatDialog
  MAT_DIALOG_DATA,  // Token to inject data passed to a dialog
  MatDialogTitle,  // Directive for dialog title
  MatDialogContent,  // Directive for dialog content
  MatDialogActions  // Directive for dialog actions (e.g., buttons)
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';  // Import form builder, form group, and validators for reactive forms
import { MatButtonModule } from '@angular/material/button';  // Import Material Button module
import { MatInputModule } from '@angular/material/input';  // Import Material Input module
import { MatFormFieldModule } from '@angular/material/form-field';  // Import Material Form Field module
import { MatCheckboxModule } from '@angular/material/checkbox';  // Import Material Checkbox module
import { CommonModule } from '@angular/common';  // Import CommonModule for common Angular directives
import { DropboxSignService } from '../dropbox-sign.service';  // Import custom service for Dropbox Sign API

@Component({
  selector: 'app-signature-request-dialog',
  templateUrl: './signature-request-dialog.component.html',  // Template file for the component's view
  styleUrls: ['./signature-request-dialog.component.css'],  // Stylesheet file for the component's styles
  standalone: true,  // Indicates this component is standalone and doesn't need to be declared in an NgModule
  imports: [
    CommonModule,  // Common Angular directives (e.g., ngIf, ngFor)
    ReactiveFormsModule,  // Provides reactive form functionality
    MatFormFieldModule,  // Material Design form field container
    MatInputModule,  // Material Design input control
    MatButtonModule,  // Material Design button control
    MatDialogTitle,  // Material dialog title directive
    MatDialogContent,  // Material dialog content directive
    MatDialogActions,  // Material dialog actions directive
    MatCheckboxModule  // Material checkbox control
  ]
})
export class SignatureRequestDialogComponent {
  form: FormGroup;  // FormGroup instance to manage the form's data and validation
  action: string;  // Variable to store the action type (e.g., send, update)
  selectedFile: File | null = null;  // Variable to store the selected file for upload

  constructor(
    public dialogRef: MatDialogRef<SignatureRequestDialogComponent>,  // Inject the reference to the dialog
    @Inject(MAT_DIALOG_DATA) public data: any,  // Inject the data passed to the dialog
    private fb: FormBuilder,  // Inject FormBuilder to create the form group
    private dropboxSignService: DropboxSignService  // Inject the DropboxSignService to handle API requests
  ) {
    this.action = data.action;  // Assign the passed action data to the component's action variable
    this.form = this.fb.group({  // Initialize the form with required fields and validators
      title: ['', Validators.required],  // Title field with required validator
      subject: ['', Validators.required],  // Subject field with required validator
      message: ['', Validators.required],  // Message field with required validator
      signerEmail1: ['', [Validators.required, Validators.email]],  // Signer email field with required and email validators
      enableSms: [false],  // Toggle for enabling SMS notifications
      phoneNumber: [{ value: '', disabled: true }],  // Phone number field, disabled by default
      useTextTags: [false],  // New checkbox for using text tags
      signatureRequestId: [''],  // Field for signature request ID
      signatureId: ['']  // Field for signature ID
    });

    // Subscribe to changes in the enableSms field to enable/disable phoneNumber field
    this.form.get('enableSms')?.valueChanges.subscribe(enable => {
      if (enable) {
        this.form.get('phoneNumber')?.enable();  // Enable phone number field if SMS is enabled
      } else {
        this.form.get('phoneNumber')?.disable();  // Disable phone number field if SMS is disabled
      }
    });
  }

  // Method to close the dialog without taking any action
  onNoClick(): void {
    this.dialogRef.close();  // Close the dialog and return no result
  }

  // Method to handle the form submission
  onSubmit(): void {
    if (this.form.valid) {  // Check if the form is valid
      switch (this.action) {  // Switch case to handle different actions
        case 'sendSignatureRequest':
          this.sendSignatureRequest();  // Call the method to send a signature request
          break;
        case 'listSignatureRequests':
          this.listSignatureRequests();  // Call the method to list signature requests
          break;
        case 'updateSignatureRequest':
          this.updateSignatureRequests();  // Call the method to update a signature request
          break;
        default:
          console.error('Unknown action:', this.action);  // Log an error if the action type is unknown
      }
    }
  }

  // Method to perform specific actions like fetching or downloading files
  performAction(action: string): void {
    switch (action) {  // Switch case to handle different actions
      case 'getSignatureRequest':
        this.getSignatureRequest();  // Call the method to get signature request details
        break;
      case 'downloadFiles':
        this.downloadFiles('pdf');  // Call the method to download files as PDF (change to 'zip' if needed)
        break;
      case 'downloadFilesAsUri':
        this.downloadFilesAsUri();  // Call the method to download files as URI
        break;
      case 'downloadFilesAsFileUrl':
        this.downloadFilesAsFileUrl();  // Call the method to download files as URL
        break;
      default:
        console.error('Unknown action:', action);  // Log an error if the action type is unknown
    }
  }

  // Method to send a signature request using the form data
  sendSignatureRequest(): void {
    const formData = new FormData();  // Create a FormData object to hold form values
    formData.append('title', this.form.get('title')?.value);  // Append title to the form data
    formData.append('subject', this.form.get('subject')?.value);  // Append subject to the form data
    formData.append('message', this.form.get('message')?.value);  // Append message to the form data
    formData.append('signers[0][email_address]', this.form.get('signerEmail1')?.value);  // Append signer email to the form data
    formData.append('signers[0][name]', 'Signer Name');  // Replace with actual signer name if available
    formData.append('signers[0][order]', '0');  // Append signer order

    if (this.form.get('enableSms')?.value) {
      formData.append('signers[0][sms_phone_number]', this.form.get('phoneNumber')?.value);  // Append SMS phone number if enabled
    }

    if (this.selectedFile) {
      formData.append('files[0]', this.selectedFile);  // Append the selected file to the form data
    } else {
      console.error('No file selected');  // Log an error if no file is selected
    }

    if (this.form.get('useTextTags')?.value) {
      formData.append('use_text_tags', '1');  // Append use_text_tags if the checkbox is checked
    }

    formData.append('test_mode', '1');  // Example of additional field

    // Call the service to send the signature request
    this.dropboxSignService.sendSignatureRequest(formData).subscribe(response => {
      this.dialogRef.close(response);  // Close the dialog and return the response
    }, error => {
      console.error('Error sending signature request', error);  // Log an error if the request fails
    });
  }

  // Method to list all signature requests
  listSignatureRequests(): void {
    this.dropboxSignService.listSignatureRequests().subscribe(response => {  // Call the service to list all signature requests
      this.dialogRef.close(response);  // Close the dialog and return the response
    }, error => {
      console.error('Error listing signature requests', error);  // Log an error if listing the requests fails
    });
  }

  // Method to update a signature request
  updateSignatureRequests(): void {
    const formData = new FormData();  // Create a FormData object to hold form values
    formData.append('signers[0][email_address]', this.form.get('signerEmail1')?.value);  // Append signer email to the form data
    formData.append('signatureId', this.form.get('signatureId')?.value);  // Append signature ID to the form data
    formData.append('test_mode', '1');  // Example of additional field

    // Call the service to update the signature request
    this.dropboxSignService.updateSignatureRequest('signatureRequestId', formData).subscribe(response => {
      this.dialogRef.close(response);  // Close the dialog and return the response
    }, error => {
      console.error('Error updating signature request', error);  // Log an error if updating the request fails
    });
  }

  // Method to get details of a specific signature request
  getSignatureRequest(): void {
    const signatureRequestId = this.form.get('signatureRequestId')?.value;  // Get the signature request ID from the form
    if (signatureRequestId) {
      this.dropboxSignService.getSignatureRequest(signatureRequestId).subscribe(response => {  // Call the service to get the signature request details
        console.log('Signature request details:', response);  // Log the signature request details
      }, error => {
        console.error('Error fetching signature request', error);  // Log an error if fetching the request fails
      });
    }
  }

  // Method to download files associated with a signature request
  downloadFiles(fileType: 'pdf' | 'zip'): void {
    const signatureRequestId = this.form.get('signatureRequestId')?.value;  // Get the signature request ID from the form
    if (signatureRequestId) {
      this.dropboxSignService.downloadFiles(signatureRequestId, fileType).subscribe(response => {  // Call the service to download the files
        console.log('Files downloaded:', response);  // Log the downloaded files response
      }, error => {
        console.error('Error downloading files', error);  // Log an error if downloading the files fails
      });
    }
  }

  // Method to download files as a data URI
  downloadFilesAsUri(): void {
    const signatureRequestId = this.form.get('signatureRequestId')?.value;  // Get the signature request ID from the form
    if (signatureRequestId) {
      this.dropboxSignService.downloadFilesAsUri(signatureRequestId).subscribe(response => {  // Call the service to download files as a URI
        console.log('Files as URI:', response);  // Log the files as URI response
      }, error => {
        console.error('Error downloading files as URI', error);  // Log an error if downloading the files as URI fails
      });
    }
  }

  // Method to download files as a URL
  downloadFilesAsFileUrl(): void {
    const signatureRequestId = this.form.get('signatureRequestId')?.value;  // Get the signature request ID from the form
    if (signatureRequestId) {
      this.dropboxSignService.downloadFilesAsFileUrl(signatureRequestId).subscribe(response => {  // Call the service to download files as a URL
        console.log('Files as URL:', response);  // Log the files as URL response
      }, error => {
        console.error('Error downloading files as URL', error);  // Log an error if downloading the files as URL fails
      });
    }
  }

  // Method to handle file selection
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];  // Get the selected file from the event
    if (file) {
      this.selectedFile = file;  // Store the selected file in the component's variable
    }
  }
}
