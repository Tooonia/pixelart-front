import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { PixelartSimpleItem } from '../../model/pixelart-simple-item';
import { PixelartRequestItem } from '../../model/pixelart-request-item';

/**
 * PixelartFormPageComponent
 *
 * The parent component of ManagePixelartComponent, doing fetching data,
 * doing editPixelArt / createPixelArt page rendering and page-level routing.
 */

@Component({
  selector: 'app-pixelart-form-page',
  templateUrl: './pixelart-form-page.component.html',
  styleUrls: ['./pixelart-form-page.component.scss']
})
export class PixelartFormPageComponent implements OnInit {

  public isEditMode = false;
  public pixelartToEdit: PixelartSimpleItem | null = null;
  public emptyPixelart: PixelartRequestItem = { name: '', width: 0, height: 0, canvas: [] };

  constructor(
    private pixelartService: PixelartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const pixelartItemId = Number(params.get('id'));
      // Double Bang operator, a concise way to convert any value
      // into its strict boolean equivalent
      this.isEditMode = !!pixelartItemId;

      if (this.isEditMode) {
        // this.pixelartService.getById(pixelartItemId).subscribe((pixelartItem: PixelartSimpleItem) => {
        this.pixelartService.getSimplePixelartById(pixelartItemId).subscribe(pixelart => {
        this.pixelartToEdit = pixelart;
        });
      }
    });
  }

  public onSave(item: PixelartSimpleItem | PixelartRequestItem): void {
    if (this.isEditMode) {
      this.pixelartService.update(item as PixelartSimpleItem).subscribe(() => {
        this.router.navigate(['pixelart', (item as PixelartSimpleItem).id]);
      });
    } else {
      this.pixelartService.add(item as PixelartRequestItem).subscribe(() => {
        this.router.navigate(['/pixelart/catalog']);
      });
    }
  }

  public onCancel(): void {
    if (this.isEditMode && this.pixelartToEdit) {
      this.router.navigate(['/pixelart', this.pixelartToEdit.id]);
    } else {
      this.router.navigate(['/pixelart/catalog']);
    }
  }
}