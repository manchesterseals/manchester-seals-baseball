import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('manchester-seals');

  constructor(private router: Router) {}

  navigateToRoster() {
    this.router.navigate(['/roster']);
  }
}
