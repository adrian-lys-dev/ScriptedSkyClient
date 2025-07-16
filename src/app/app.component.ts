import { Component, signal } from '@angular/core';
import { HeaderComponent } from "./layout/header/header.component";
import { HomeComponent } from "./features/home/home.component";
import { FooterComponent } from "./layout/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, HomeComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly title = signal('ScriptedSkyClient');
}
