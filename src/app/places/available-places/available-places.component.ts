import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

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
  isFetching = signal(false);
  error = signal('');

  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  // constructor(private httpClient:HttpClient) { }   // ALternative

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/places').pipe(
      map((resData) => resData.places),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error('Something went wrong with fetching available places. Please try again later.'));
      })
    ).subscribe({
      next: (places) => {
        // console.log(resData.places);
        this.places.set(places);
      },
      error: (err: Error) => {
        // console.log(err);
        this.error.set(err.message);
      },
      complete: () => {
        this.isFetching.set(false);
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onSelectPlace(selectedPlace: Place) {
    this.httpClient.put('http://localhost:3000/user-places', {
      placeId: selectedPlace.id
    }).subscribe({
      next: (resData) => console.log(resData)
    });
  }

}
