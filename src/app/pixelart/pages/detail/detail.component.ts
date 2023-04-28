import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
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
  // TODO: n°161: itt nincs @Input(), mert Routing-gal kapjuk a pixelartItem infot!
pixelartToDisplay! : PixelartItem;
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
    allowToUpdate: boolean = false;
    id!: number;

  constructor(
    private pixelartService : PixelartService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {

  }
// TODO: nagyon darabosan tolti be a detail oldalt, meg biztos nem jo!!!
  ngOnInit(): void {
    // n°161 NOT WORKING:
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        // this.pixelartToDisplay = this.pixelartService.getById(id);
        // this.pixelartToDisplay = params;
        console.log('Detail id value: '+ this.id); // MUKODIK: Kiadja a szamot!
        this.isSignedin = this.authService.isUserSignedin();

        this.pixelartService.getById(this.id).subscribe((data: PixelartItem) => {
            this.pixelartToDisplay = data;
            console.log('EZ A DETAIL : ' +this.pixelartToDisplay); //object Object ez is!!! NEM MUKODIK!!!
            // console.log(this.isSignedin);
            // console.log(this.authService.getSignedinUser());
            // console.log(this.pixelartToDisplay.user); //undefined
            const userEmail = this.authService.getSignedinUser();
            // TODO: ide kell, if (signedIn), mert egyelore folyamatosan me?email=null-t mutat, ha a detail-re megyek es utana a Network-ot nezem!!!
            if (userEmail) {
              this.userService.getUserProfileByEmail(userEmail).subscribe( (user: UserGetItem) => {
                const userPixelarts = user.pixelarts;
                for (let i = 0; i < userPixelarts.length; i++) {
                 if (userPixelarts[i].id === this.id) {
                    this.allowToUpdate = true;
                  }
               }

            // if (this.isSignedin && this.pixelartToDisplay.user.user_email === this.authService.getSignedinUser()) { //TODO: hogy ferek hozza a user infohoz ez pixelart-bol??? NEM MEGY, undefined, mert id_user_fk a user es nem ismeri fel user-rel!
            //   console.log(this.pixelartToDisplay.user.user_email);
            //   this.allowToUpdate = true;
            //  }
              }
              )
            }

  });



    // PREVIOUSLY IN THIS CLASS:
    // TODO: from video n°133 the syntax is: this.route.snapshot.params['id']
    // https://stackoverflow.com/questions/68006823/angular-11-type-observableobject-is-missing-the-following-properties-from-ty
    // n°161 as well:
    // const id = +this.route.snapshot.params['id'];
    // this.pixelartService.getById(id).subscribe((data: PixelartItem) => {
    //   this.pixelartToDisplay = data;
    //   // this.pixelartToDisplay.id = data['id']; //TODO: ezekkel nem megy!
    //   // this.pixelartToDisplay.name = data['name'];
    //   // this.pixelartToDisplay.user = data['user'];
    //   // console.log(this.pixelartToDisplay);
    //  });
    // TODO: nekem nem megy ugy, ahogy a tanar irta, mert en a getById() methodomban Observable-lal dolgozom, itt meg PixelartItem van.
    // const id = +this.route.snapshot.params['id'];
    // this.pixelartToDisplay = this.pixelartService.getById(id);


// 2nd try based on update.component.ts // PREVIOUSLY this part was in the constructor(), but better to do
// all initialization in the ngOnInit()
// TODO: n°134 szerint ez csak akkor kell, ha a page might be reloaded with updated info, and we want to react to any changes thereafter:
    // this.route.paramMap.subscribe((params: ParamMap) => {
    //   const pixelartItemId = Number(params.get('id'));
    //   console.log(pixelartItemId);
    //   this.pixelartService.getById(pixelartItemId).subscribe((data: PixelartItem) => {
    //     this.pixelartToDisplay = data;
    //   })
    // });

    // THIS SOLUTION ALWAYS SHOWS THE LAST PIXELART OF THE CONNECTED USER:

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
		})
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
    // this.router.navigate(['/pixelart/catalog']); //TODO: itt kell revenir à l'étape précédente/url précédente!!!

    // this.location.back(); //TODO: NOT WORKING WELL, as goes back to 'manage-pixelart' all the time, needs to be completed!!! as there is one situation it might not work!!! itt kell revenir à l'étape précédente/url précédente!!!
    //Valami olyasmi kell, h 'if previous url my-pixelart, akkor oda menjen vissza, egyebkent meg a fooldal listajara'.
    this.router.navigate(['/pixelart/catalog']); //TODO: itt kell revenir à l'étape précédente/url précédente!!!
    // this.router.navigate(['../'], {relativeTo: this.route}); //TODO: itt kell revenir à l'étape précédente/url précédente!!!
  }

  // TODO: normally editPixelart and deletePixelart both redirect to portfolio page
  // as only a connected user will see those buttons on own pixelarts!
  editPixelart(): void {
    this.router.navigate(['/pixelart/edit-pixelart', this.pixelartToDisplay.id])
  }

  deletePixelart(): void {
  // TODO Itt kellene lehet az a tab(), hogy tovabbi dolgokat csinalhassunk sans toucher à l'élément à voir?
  // TODO vagy valahogy egy blokkba tenni ezt a ket subscribe dolgot?
  // TODO Is it supposed to be in the service.ts, with the delete() method, the refreshcollection part?
    // console.log(pixelartItem.id);
    this.pixelartService.deleteById(this.pixelartToDisplay.id).subscribe((resp) => {
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
