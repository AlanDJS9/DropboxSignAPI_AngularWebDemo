import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { DropboxSignService } from '../dropbox-sign.service';

@Component({
  selector: 'app-signature-request-dialog',
  templateUrl: './signature-request-dialog.component.html',
  styleUrls: ['./signature-request-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatCheckboxModule
  ]
})
export class SignatureRequestDialogComponent {
  form: FormGroup;
  action: string;
  selectedFile: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<SignatureRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dropboxSignService: DropboxSignService
  ) {
    this.action = data.action;
    this.form = this.fb.group({
      title: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      signerEmail1: ['', [Validators.required, Validators.email]],
      enableSms: [false],
      phoneNumber: [{ value: '', disabled: true }],
      useTextTags: [false], // New checkbox for text tags
      signatureRequestId: [''],
      signatureId: ['']

    });

    this.form.get('enableSms')?.valueChanges.subscribe(enable => {
      if (enable) {
        this.form.get('phoneNumber')?.enable();
      } else {
        this.form.get('phoneNumber')?.disable();
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      switch (this.action) {
        case 'sendSignatureRequest':
          this.sendSignatureRequest();
          break;
        case 'listSignatureRequests':
          this.listSignatureRequests();
          break;
        case 'updateSignatureRequest':
          this.updateSignatureRequests();
          break;
        default:
          console.error('Unknown action:', this.action);
      }
    }
  }

  performAction(action: string): void {
    switch (action) {
      case 'getSignatureRequest':
        this.getSignatureRequest();
        break;
      case 'downloadFiles':
        this.downloadFiles('pdf'); // Example with PDF, change if .ZIP desired
        break;
      case 'downloadFilesAsUri':
        this.downloadFilesAsUri();
        break;
      case 'downloadFilesAsFileUrl':
        this.downloadFilesAsFileUrl();
        break;
      default:
        console.error('Unknown action:', action);
    }
  }

  sendSignatureRequest(): void {
    const formData = new FormData();
    formData.append('title', this.form.get('title')?.value);
    formData.append('subject', this.form.get('subject')?.value);
    formData.append('message', this.form.get('message')?.value);
    formData.append('signers[0][email_address]', this.form.get('signerEmail1')?.value);
    formData.append('signers[0][name]', 'Signer Name'); // Replace with actual name if available
    formData.append('signers[0][order]', '0');

    if (this.form.get('enableSms')?.value) {
      formData.append('signers[0][sms_phone_number]', this.form.get('phoneNumber')?.value);
    }

    if (this.selectedFile) {
      formData.append('files[0]', this.selectedFile);
    } else {
      console.error('No file selected');
    }

    if (this.form.get('useTextTags')?.value) {
      formData.append('use_text_tags', '1');
    }

    formData.append('test_mode', '1'); // Example of additional field

    this.dropboxSignService.sendSignatureRequest(formData).subscribe(response => {
      this.dialogRef.close(response);
    }, error => {
      console.error('Error sending signature request', error);
    });
  }

  listSignatureRequests(): void {
    this.dropboxSignService.listSignatureRequests().subscribe(response => {
      this.dialogRef.close(response);
    }, error => {
      console.error('Error listing signature requests', error);
    });
  }
  updateSignatureRequests(): void {
    const formData = new FormData();
    formData.append('signers[0][email_address]', this.form.get('signerEmail1')?.value);
    formData.append('signatureId', this.form.get('signatureId')?.value);
    formData.append('test_mode', '1'); // Example of additional field

    this.dropboxSignService.updateSignatureRequest('signatureRequestId',formData).subscribe(response => {
      this.dialogRef.close(response);
    }, error => {
      console.error('Error listing signature requests', error);
    });
  }
  getSignatureRequest(): void {
    const signatureRequestId = this.form.get('signatureRequestId')?.value;
    if (signatureRequestId) {
      this.dropboxSignService.getSignatureRequest(signatureRequestId).subscribe(response => {
        console.log('Signature request details:', response);
      }, error => {
        console.error('Error fetching signature request', error);
      });
    }
  }

  downloadFiles(fileType: 'pdf' | 'zip'): void {
    const signatureRequestId = this.form.get('signatureRequestId')?.value;
    if (signatureRequestId) {
      this.dropboxSignService.downloadFiles(signatureRequestId, fileType).subscribe(response => {
        // Handle file download
        console.log('Files downloaded:', response);
      }, error => {
        console.error('Error downloading files', error);
      });
    }
  }

  downloadFilesAsUri(): void {
    const signatureRequestId = this.form.get('signatureRequestId')?.value;
    if (signatureRequestId) {
      this.dropboxSignService.downloadFilesAsUri(signatureRequestId).subscribe(response => {
        console.log('Files as URI:', response);
      }, error => {
        console.error('Error downloading files as URI', error);
      });
    }
  }

  downloadFilesAsFileUrl(): void {
    const signatureRequestId = this.form.get('signatureRequestId')?.value;
    if (signatureRequestId) {
      this.dropboxSignService.downloadFilesAsFileUrl(signatureRequestId).subscribe(response => {
        console.log('Files as URL:', response);
      }, error => {
        console.error('Error downloading files as URL', error);
      });
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
}
