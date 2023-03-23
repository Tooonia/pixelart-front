import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { PixelartService } from 'src/app/core/services/pixelart.service';
import { UserService } from 'src/app/core/services/user.service';
import { PixelartItem } from '../../model/pixelart-item';
import { UserGetItem } from '../../model/user-get-item';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
@Input() pixelartToDisplay! : PixelartItem;
  // TODO: works with or without @Input() when used with get pixelartName method. Why?:
  // so pixelartItem.name is printed out, but 2 error messages if I refresh the page,
  // 1 if I click on Details:
  // "Cannot read properties of undefined (reading 'name')
    // at DetailComponent_Template (detail.component.html:18:25)"
  //  @Input() private pixelartItem!: PixelartItem;
    // pixelartItem!: PixelartItem;
    // @Input() pixelartItem!: PixelartItem;
    pixelartItemsList!: PixelartItem[];
  // private _pixelartItem!: PixelartItem;

    isSignedin = false;
    signedinUser! : UserGetItem;
    signedinUserPixelartList!: PixelartItem[];
    buttonsToShow: boolean = false;

  constructor(
    private pixelartService : PixelartService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    // 2nd try based on update.component.ts
    this.route.paramMap.subscribe((params: ParamMap) => {
      const pixelartItemId = Number(params.get('id'));
      console.log(pixelartItemId);
      this.pixelartService.getById(pixelartItemId).subscribe((data: PixelartItem) => {
        this.pixelartToDisplay = data;
      })
    })
  }

  ngOnInit(): void {
    // PREVIOUSLY IN THIS CLASS:
    // this.pixelartService.getById(this.route.snapshot.params.id).subscribe(data => {
    //   this.pixelartItem = data;
    //  //  console.log(this.pixelartItem)
    //  });

    // THIS SOLUTION ALWAYS SHOWS THE LAST PIXELART OF THE CONNECTED USER:
    this.isSignedin = this.authService.isUserSignedin();
    // if(this.authService.isUserSignedin() ) {
    //   this.route.paramMap.subscribe((params: ParamMap) => {
    //     const pixelartItemId = Number(params.get('id'));
    //     console.log(pixelartItemId);
    //     this.pixelartService.getById(pixelartItemId).subscribe(data => {
    //       this.pixelartItem = data;

    //       this.userService.getPrivateUserProfile().subscribe(data => {
    //         this.signedinUser = data;
    //         console.log(this.signedinUser);
    //         this.pixelartService.getAllPixelArtByUser(this.signedinUser.id).subscribe((data: PixelartItem[]) => {
    //           this.signedinUserPixelartList = data;

    //           for(this.pixelartItem of this.signedinUserPixelartList) {
    //             this.buttonsToShow = true;
    //           }
    //           // this.pixelartService.getById(pixelartItemId).subscribe((data: PixelartItem) => {
    //           // this.pixelartItem = data;
    //         })
    //     })
    //   })

    // if(this.authService.isUserSignedin() && signedinUserHassAccessToPixelart) {
          // mutassa az Edit es delete button-okat }
      // ha nincs bejelentkezve, akkor /pixelart-piblic-info
      // ha be van jelentkezve: akkor private info ??
		}
// 1st try
    // this.pixelartService.getById(this.route.snapshot.params.id).subscribe(data => {
    //    this.pixelartItem = data;
    //   //  console.log(this.pixelartItem)
    //   });

  // )}

  // TODO: if I declare pixelartItem "private", then it only works with this following get method, otherwise this error message:
  // Property 'pixelartItem' is private and only accessible within class 'DetailComponent'.
  // QUESTON: better to use "private" for pixelartItem and this method,
  // or the usual "pixelartItem.name"?
  //    get pixelartItemName(): String {
  //       console.log(this.pixelartItem.name);
  //       return this.pixelartItem.name as String;
  //  }

  closePixelartDetails(): void {
    // TODO: see navigation history eventually instead : route-history.service.ts
    // We need here: come back to previously visited page if possible, if not, go to catalog!
    // For now, it is not smooth enough, when window changes
    this.router.navigate(['/pixelart/catalog'])
  }

  // TODO: normally editPixelart and deletePixelart both redirect to portfolio page
  // as only a connected user will see those buttons on own pixelarts!
  editPixelart(pixelartItem: PixelartItem): void {
    this.router.navigate(['/pixelart/edit-pixelart', pixelartItem.id])
  }

  deletePixelart(pixelartItem: PixelartItem): void {
  // TODO Itt kellene lehet az a tab(), hogy tovabbi dolgokat csinalhassunk sans toucher à l'élément à voir?
  // TODO vagy valahogy egy blokkba tenni ezt a ket subscribe dolgot?
  // TODO Is it supposed to be in the service.ts, with the delete() method, the refreshcollection part?
    console.log(pixelartItem.id);
    this.pixelartService.deleteById(pixelartItem.id).subscribe((resp) => {
      console.log("Delete OK: ", resp);
      // Kell valami error message, h nem sikerult torolni, mert akkor is az irja ki consoleba, h OK,
      // ha adott szemelynek ne, volt hozzaferese!
      this.pixelartService.findAll().subscribe((data: PixelartItem[]) => {
        this.pixelartItemsList = data;
        this.router.navigate(['/pixelart/catalog'])
      },
        error => {
        console.log(error);
      })

    });
  }
}
