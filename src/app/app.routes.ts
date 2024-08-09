import { Routes } from '@angular/router';
import { AccountRequestsComponent } from './account-requests/account-requests.component';
import { SignatureRequestComponent } from './signature-request/signature-request.component';
import { EmbeddedSignaturesRequestComponent } from './embedded-signatures-request/embedded-signatures-request.component';
import { SignatureSimulatorComponent } from './signature-simulator/signature-simulator.component';

// Define the application's route configuration
export const appRoutes: Routes = [
  { path: 'account-requests', component: AccountRequestsComponent },  // Route for Account Requests page
  { path: 'signature-request', component: SignatureRequestComponent },  // Route for Signature Request page
  { path: 'embedded-signatures-request', component: EmbeddedSignaturesRequestComponent },  // Route for Embedded Signatures Request page
  { path: 'signature-simulator', component: SignatureSimulatorComponent },  // Route for Signature Simulator page
  { path: '', redirectTo: '/account-requests', pathMatch: 'full' }  // Default route, redirect to Account Requests page
];
