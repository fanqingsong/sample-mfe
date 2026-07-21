import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { mfeCommunicationFeature } from '@sample-mfe/mfe-communication';

@Component({
    selector: 'app-list',
    imports: [AsyncPipe],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss'
})
export class ListComponent {
  private store = inject(Store);
  selectedUser$ = this.store.select(mfeCommunicationFeature.selectSelectedUser);
}
