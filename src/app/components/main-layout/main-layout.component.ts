import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidebarComponent, BottomNavComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  protected layoutService = inject(LayoutService);
}
