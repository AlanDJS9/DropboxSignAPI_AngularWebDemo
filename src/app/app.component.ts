import { Component } from '@angular/core';  // Import Angular's core component decorator
import { MatToolbarModule } from '@angular/material/toolbar';  // Import Material Toolbar module for using toolbar UI components
import { MatTabsModule } from '@angular/material/tabs';  // Import Material Tabs module for using tabbed UI components
import { AccountRequestsComponent } from './account-requests/account-requests.component';  // Import AccountRequestsComponent to include in the root component
import { SignatureRequestComponent } from './signature-request/signature-request.component';  // Import SignatureRequestComponent to include in the root component
import { EmbeddedSignaturesRequestComponent } from './embedded-signatures-request/embedded-signatures-request.component';  // Import EmbeddedSignaturesRequestComponent to include in the root component
import { SignatureSimulatorComponent } from './signature-simulator/signature-simulator.component';  // Import SignatureSimulatorComponent to include in the root component

@Component({
  imports: [
    MatToolbarModule,  // Include Material Toolbar module to use toolbar elements in the template
    MatTabsModule,  // Include Material Tabs module to use tabbed navigation in the template
    AccountRequestsComponent,  // Include AccountRequestsComponent to render its content within this component
    SignatureRequestComponent,  // Include SignatureRequestComponent to render its content within this component
    EmbeddedSignaturesRequestComponent,  // Include EmbeddedSignaturesRequestComponent to render its content within this component
    SignatureSimulatorComponent  // Include SignatureSimulatorComponent to render its content within this component
  ],
  selector: 'app-root',  // Define the selector for this component; this tag is used in the index.html to load the app
  standalone: true,  // Indicates this component is standalone and doesn't need to be declared in an NgModule
  styleUrls: ['./app.component.css'],  // Link to the component's CSS styles
  templateUrl: './app.component.html'  // Link to the component's HTML template
})
export class AppComponent { }  // Define the root component class, which is empty in this case
