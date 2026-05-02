import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BackComponent } from '../../components/back/back.component';
import { NgFor, NgIf } from '@angular/common';
import { EditMontageComponent } from '../../components/edit-montage/edit-montage.component';
import { MontageService } from './montage.service';
import { ProductCustomizationComponent } from '../../components/product-customization/product-customization.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MontageResponse, Product } from './montage.type';

@Component({
  selector: 'app-montage',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    BackComponent,
    NgIf,
    EditMontageComponent,
    NgFor,
    ProductCustomizationComponent,
    FormsModule,
  ],
  templateUrl: './montage.component.html',
  styleUrls: [],
  providers: [MontageService],
})
export class MontageComponent {
  customization: boolean = false;
  isLoading: boolean = true;
  editMontage = false;
  montages: Product[] = [];
  filteredMontages: Product[] = [];
  selectedMontageId: string = '';
  search: string = '';
  user: any = null;
  constructor(
    private montageService: MontageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.search = params['search'] || '';
      this.loadMontages();
    });

    const userCookie = this.getCookie('user');
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userCookie));
        parsedUser.isAdmin =
          parsedUser.isAdmin === true || parsedUser.isAdmin === 'true';
        this.user = parsedUser;
      } catch {}
    }
  }

  loadMontages() {
    this.isLoading = true;

    this.montageService.getMontages('').subscribe({
      next: (data) => {
        const typedData = data as unknown as MontageResponse;
        this.montages = typedData.projects || [];
        this.applyFilter();
        this.isLoading = false;
       
      },
      error: (error) => {
        console.error('Error loading montages:', error);
        this.isLoading = false;
      },
    });
  }

  applyFilter() {
    if (!this.search.trim()) {
      this.filteredMontages = this.montages;
    } else {
      const term = this.search.toLowerCase();
      this.filteredMontages = this.montages.filter((item) =>
        item.title.toLowerCase().includes(term)
      );
    }
  }

  openEditModal(id: string) {
    this.selectedMontageId = id;
    this.editMontage = true;
  }

  ProductCustomization(id: string) {
    this.selectedMontageId = id;
    this.customization = true;
  }

  getCookie(name: string): string | null {
    if (typeof document !== 'undefined') {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }
}
