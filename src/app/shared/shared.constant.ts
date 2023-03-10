import { HttpClientModule } from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import {NgxNavbarModule} from 'ngx-bootstrap-navbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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