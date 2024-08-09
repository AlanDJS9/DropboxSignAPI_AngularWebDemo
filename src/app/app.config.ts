import { ApplicationConfig } from '@angular/core';  // Import Angular's ApplicationConfig type
import { provideRouter } from '@angular/router';  // Import function to provide routing capabilities
import { provideHttpClient } from '@angular/common/http';  // Import function to provide HTTP client services
import { appRoutes } from './app.routes';  // Import the application's routing configuration
import { importProvidersFrom } from '@angular/core';  // Import function to bring in providers from external modules
import { BrowserModule } from '@angular/platform-browser';  // Import Angular's BrowserModule for running the application in the browser
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // Import module for enabling animations in the browser
import { MatFormFieldModule } from '@angular/material/form-field';  // Import Material Design form field module
import { MatInputModule } from '@angular/material/input';  // Import Material Design input module
import { MatButtonModule } from '@angular/material/button';  // Import Material Design button module
import { MatDialogModule } from '@angular/material/dialog';  // Import Material Design dialog module
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Import Angular's forms modules for template-driven and reactive forms
import { MatTabsModule } from '@angular/material/tabs';  // Import Material Design tabs module
import { SafeUrlPipe } from './safe-url.pipe';  // Import custom pipe for handling safe URLs

// Define the application's configuration
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),  // Provide the application's routing configuration
    provideHttpClient(),  // Provide HTTP client services for making HTTP requests
    importProvidersFrom([
      BrowserModule,  // Include BrowserModule for browser-specific services
      BrowserAnimationsModule,  // Include BrowserAnimationsModule for enabling animations
      MatFormFieldModule,  // Include Material Design form field module
      MatInputModule,  // Include Material Design input module
      MatButtonModule,  // Include Material Design button module
      MatDialogModule,  // Include Material Design dialog module
      FormsModule,  // Include FormsModule for template-driven forms
      ReactiveFormsModule,  // Include ReactiveFormsModule for reactive forms
      MatTabsModule,  // Include Material Design tabs module
      SafeUrlPipe  // Include the custom SafeUrlPipe for handling safe URLs
    ])
  ]
};
