import { Component, Inject } from '@angular/core';  // Import necessary Angular core components and decorators
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
import { CommonModule } from '@angular/common';  // Import CommonModule for common Angular directives
import { DropboxSignService } from '../dropbox-sign.service';  // Import custom service for Dropbox Sign API
import { environment } from '../../environments/environment';  // Import environment variables

@Component({
  selector: 'app-embedded-request-dialog',
  templateUrl: './embedded-request-dialog.component.html',  // Template file for the component's view
  styleUrls: ['./embedded-request-dialog.component.css'],  // Stylesheet file for the component's styles
  standalone: true,  // Indicates this component is standalone and doesn't need to be declared in an NgModule
  imports: [
    CommonModule,  // Common Angular directives (e.g., ngIf, ngFor)
    ReactiveFormsModule,  // Provides reactive form functionality
    MatFormFieldModule,  // Material Design form field container
    MatInputModule,  // Material Design input control
    MatButtonModule,  // Material Design button control
    MatDialogTitle,  // Material dialog title directive
    MatDialogContent,  // Material dialog content directive
    MatDialogActions  // Material dialog actions directive
  ]
})
export class EmbeddedRequestDialogComponent {
  form: FormGroup;  // FormGroup instance to manage the form's data and validation
  action: string;  // Variable to store the action type (e.g., create, update)
  selectedFile: File | null = null;  // Variable to store the selected file for upload

  constructor(
    public dialogRef: MatDialogRef<EmbeddedRequestDialogComponent>,  // Inject the reference to the dialog
    @Inject(MAT_DIALOG_DATA) public data: any,  // Inject the data passed to the dialog
    private fb: FormBuilder,  // Inject FormBuilder to create the form group
    private dropboxSignService: DropboxSignService  // Inject the DropboxSignService to handle API requests
  ) {
    this.action = data.action;  // Assign the passed action data to the component's action variable
    this.form = this.fb.group({  // Initialize the form with required fields and validators
      email: ['', [Validators.required, Validators.email]],  // Email field with required and email validators
      name: ['', Validators.required],  // Name field with required validator
      templateId: ['']  // Optional template ID field
    });

    if (this.action !== 'createEmbeddedSignatureRequest') {
      this.form.get('templateId')?.setValidators([Validators.required]);  // Make templateId required if the action is not for simple embedded signature request
    }
  }

  // Method to close the dialog without taking any action
  onNoClick(): void {
    this.dialogRef.close();  // Close the dialog and return no result
  }

  // Method to handle the form submission
  onSubmit(): void {
    if (this.form.valid) {  // Check if the form is valid
      const formData = new FormData();  // Create a FormData object to hold form values
      formData.append('signers[0][email_address]', this.form.get('email')?.value);  // Append email to the form data
      formData.append('signers[0][name]', this.form.get('name')?.value);  // Append name to the form data
      formData.append('signers[0][order]', '0');  // Append order to the form data
      formData.append('client_id', environment.clientId);  // Append client ID from environment variables
      formData.append('test_mode', '1');  // Example of additional field, appending test mode

      if (this.form.get('templateId')?.value) {  // Check if template ID is provided
        formData.append('templateId', this.form.get('templateId')?.value);  // Append template ID to the form data
      }
      if (this.selectedFile) {  // Check if a file is selected
        formData.append('file', this.selectedFile);  // Append the selected file to the form data
      } else {
        console.error('No file selected');  // Log an error if no file is selected
      }

      // Switch statement to handle different actions
      switch (this.action) {
        case 'createEmbeddedSignatureRequest':
          this.dropboxSignService.createEmbeddedSignatureRequest(formData).subscribe(response => {
            this.dialogRef.close(response);  // Close the dialog and return the response
          }, error => {
            console.error('Error creating embedded signature request', error);  // Log an error if request fails
          });
          break;
        case 'createEmbeddedSignatureRequestWithTemplate':
          this.dropboxSignService.createEmbeddedSignatureRequestWithTemplate(formData).subscribe(response => {
            this.dialogRef.close(response);  // Close the dialog and return the response
          }, error => {
            console.error('Error creating embedded signature request with template', error);  // Log an error if request fails
          });
          break;
        default:
          console.error('Unknown action:', this.action);  // Log an error if the action type is unknown
      }
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
