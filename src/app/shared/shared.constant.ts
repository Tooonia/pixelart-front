import { HttpClientModule } from '@angular/common/http';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

export const MaterialModules = [
    MatCardModule,
    MatToolbarModule,
    HttpClientModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule
];