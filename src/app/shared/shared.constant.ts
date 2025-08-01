import { HttpClientModule } from '@angular/common/http';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {NgxNavbarModule} from 'ngx-bootstrap-navbar';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

export const MaterialModules = [
    MatCardModule,
    NgxNavbarModule,
    HttpClientModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule
];