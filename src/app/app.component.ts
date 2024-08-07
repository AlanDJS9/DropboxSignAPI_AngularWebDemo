import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { AccountRequestsComponent } from './account-requests/account-requests.component';
import { SignatureRequestComponent } from './signature-request/signature-request.component';
import { EmbeddedSignaturesRequestComponent } from './embedded-signatures-request/embedded-signatures-request.component';
import { SignatureSimulatorComponent } from './signature-simulator/signature-simulator.component';

@Component({
  imports: [
    MatToolbarModule,
    MatTabsModule,
    AccountRequestsComponent,
    SignatureRequestComponent,
    EmbeddedSignaturesRequestComponent,
    SignatureSimulatorComponent
  ],
  selector: 'app-root',
  standalone: true,
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent { }
