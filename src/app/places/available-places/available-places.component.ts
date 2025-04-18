import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);

  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  // constructor(private httpClient:HttpClient) { }   // ALternative

  ngOnInit() {
    const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/places',{
      // observe: 'response'

      observe: 'events'
    }).subscribe({
      // next: (response) => {
      
      next: (event) => {
        // console.log(response);
        // console.log(response.body?.places);

        console.log(event);
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

}
