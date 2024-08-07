import { Routes } from '@angular/router';
import { AccountRequestsComponent } from './account-requests/account-requests.component';
import { SignatureRequestComponent } from './signature-request/signature-request.component';
import { EmbeddedSignaturesRequestComponent } from './embedded-signatures-request/embedded-signatures-request.component';
import { SignatureSimulatorComponent } from './signature-simulator/signature-simulator.component';

export const appRoutes: Routes = [
  { path: 'account-requests', component: AccountRequestsComponent },
  { path: 'signature-request', component: SignatureRequestComponent },
  { path: 'embedded-signatures-request', component: EmbeddedSignaturesRequestComponent },
  { path: 'signature-simulator', component: SignatureSimulatorComponent },
  { path: '', redirectTo: '/account-requests', pathMatch: 'full' }
];
