import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { appConfig } from './app/app.config';


bootstrapApplication(AppComponent, {  // Bootstraps the Angular application with the root component 'AppComponent'
  providers: [
    provideHttpClient(),  // Provide HTTP client service for making HTTP requests throughout the application
    provideRouter([]),  // Provide routing capabilities; currently, an empty array indicates no routes defined here
    importProvidersFrom(  // Import providers from various Angular modules needed for the application
      BrowserAnimationsModule,  // Enable animations in the application
      MatToolbarModule,  // Import Material Toolbar module for using toolbar components
      MatTabsModule,  // Import Material Tabs module for using tabbed navigation components
      MatFormFieldModule,  // Import Material Form Field module for using form fields
      MatInputModule,  // Import Material Input module for using input fields
      MatButtonModule  // Import Material Button module for using buttons
    )
  ]
}).catch(err => console.error(err));  // Catch and log any errors that occur during the bootstrapping process
