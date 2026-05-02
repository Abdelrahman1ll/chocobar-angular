import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { BackComponent } from '../../../components/back/back.component';
import { ClientsService } from './clients.service';
import { NgFor, NgIf } from '@angular/common';
import { User } from './clients.type';
import { ɵEmptyOutletComponent } from "../../../../node_modules/@angular/router/router_module.d-Bx9ArA6K";

@Component({
  selector: 'app-clients',
  imports: [HeaderComponent, FooterComponent, BackComponent, NgFor, NgIf],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent {
  isLoading: boolean = true;
  loading: boolean = false;
  Clients: User[] = [];
  constructor(private clientsService: ClientsService) {
    this.clientsService.getClients().subscribe((data) => {
      if (typeof data === 'object' && data !== null && 'users' in data) {
        this.Clients = (data as { users: User[] }).users;
        this.isLoading = false;
      } else {
        this.Clients = [];
        this.isLoading = false;
      }
    });
  }

  downloadPDF() {
    this.loading = true;
    this.clientsService.getPDF().subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'clients.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        
      },
    });
  }
}
