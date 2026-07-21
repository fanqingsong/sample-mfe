import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUserForProducts } from '@sample-mfe/mfe-communication';

@Component({
    selector: 'app-list',
    imports: [MatButtonModule],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss'
})
export class ListComponent {
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private store = inject(Store);

  handleNavigateToProduct() {
    this.store.dispatch(selectUserForProducts({
      user: { id: 'user-001', name: 'Alice' },
    }));
    this.router.navigate(['/products']);
  }
}
