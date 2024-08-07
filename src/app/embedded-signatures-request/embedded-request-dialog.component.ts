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
import { CommonModule } from '@angular/common';
import { DropboxSignService } from '../dropbox-sign.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-embedded-request-dialog',
  templateUrl: './embedded-request-dialog.component.html',
  styleUrls: ['./embedded-request-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
  ]
})
export class EmbeddedRequestDialogComponent {
  form: FormGroup;
  action: string;
  selectedFile: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<EmbeddedRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dropboxSignService: DropboxSignService
  ) {
    this.action = data.action;
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      templateId: ['']
    });

    if (this.action !== 'createEmbeddedSignatureRequest') {
      this.form.get('templateId')?.setValidators([Validators.required]);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('signers[0][email_address]', this.form.get('email')?.value);
      formData.append('signers[0][name]', this.form.get('name')?.value);
      formData.append('signers[0][order]', '0');
      formData.append('client_id', environment.clientId);
      formData.append('test_mode', '1'); // Example of additional field

      if (this.form.get('templateId')?.value) {
        formData.append('templateId', this.form.get('templateId')?.value);
      }
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      } else {
        console.error('No file selected');
      }

      switch (this.action) {
        case 'createEmbeddedSignatureRequest':
          this.dropboxSignService.createEmbeddedSignatureRequest(formData).subscribe(response => {
            this.dialogRef.close(response);
          }, error => {
            console.error('Error creating embedded signature request', error);
          });
          break;
        case 'createEmbeddedSignatureRequestWithTemplate':
          this.dropboxSignService.createEmbeddedSignatureRequestWithTemplate(formData).subscribe(response => {
            this.dialogRef.close(response);
          }, error => {
            console.error('Error creating embedded signature request with template', error);
          });
          break;
        default:
          console.error('Unknown action:', this.action);
      }
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
}
