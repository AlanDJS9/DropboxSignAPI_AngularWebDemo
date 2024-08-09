import { Pipe, PipeTransform } from '@angular/core';  // Import Angular's Pipe and PipeTransform for creating a custom pipe
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';  // Import DomSanitizer and SafeResourceUrl for handling safe URLs

@Pipe({
  standalone: true,  // Indicates that this pipe is standalone and doesn't need to be declared in an NgModule
  name: 'safeUrl'  // Name of the pipe that will be used in templates
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}  // Inject DomSanitizer to handle security-related tasks

  // Implement the transform method to sanitize the URL and return it as a SafeResourceUrl
  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);  // Bypass Angular's built-in security to mark the URL as safe
  }
}
