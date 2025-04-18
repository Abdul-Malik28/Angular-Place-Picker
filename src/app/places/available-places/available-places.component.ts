import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
  // providers:[HttpClient]  // Element Injector - we're not using this.
})
export class AvailablePlacesComponent {
  places = signal<Place[] | undefined>(undefined);

  private httpClient = inject(HttpClient);

  // constructor(private httpClient:HttpClient) { }
}
