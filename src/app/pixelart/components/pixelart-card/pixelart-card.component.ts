import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { PixelartItem } from '../../model/pixelart-item';

@Component({
  selector: 'app-pixelart-card',
  templateUrl: './pixelart-card.component.html',
  styleUrls: ['./pixelart-card.component.scss']
})
export class PixelartCardComponent implements OnInit {
  @Input() pixelartItem: PixelartItem | undefined;
  // pixelartItem: PixelartItem | undefined;

  constructor(
    private pixelartService: PixelartService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

}
