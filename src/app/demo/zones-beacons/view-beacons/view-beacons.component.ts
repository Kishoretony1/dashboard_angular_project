import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router } from '@angular/router';
import { ApiService } from '../../../common/api.service';
import {HttpClient} from '@angular/common/http';

import { AuthService } from '../../../common/auth.service';
// import { ModalPopupComponent } from '../modal-popup/modal-popup.component';
import { animate,state, style, transition, trigger } from '@angular/animations';
import {  FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogComponent } from 'src/app/common/dialog-component/dialog-component';
import { id_user } from '../../dashboard/view/tableData';
import { MatDialog } from '@angular/material/dialog';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { beacon_List } from '../../dashboard/view/tableData';

interface Zone {
  zoneName: string;
  zoneType: string;
  beacons: any[]; // Adjust the type accordingly
  // Add other properties as needed
}


@Component({
  selector: 'app-view-beacons',
  templateUrl: './view-beacons.component.html',
  styleUrls: ['./view-beacons.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))])
    ])
  ]

})
export class ViewBeaconsComponent implements OnInit, AfterViewInit
{
  displayedColumns: string[] =['serialNumber', 'activationAt', 'zoneName', 'action'];
  dataSource: MatTableDataSource<beacon_List> = new MatTableDataSource();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  // data: any;
  data :any = {};
  filterText : string = '';
  dropdownOptions: string[] = [];
  totalLeanthFMlookup: any;
  page = 0;
  size = 10;
  pge = 1;
  nextbutton!: boolean;
  prevbutton!: boolean;

  optionTypes!: any[];

  pagedData!: any[];

  shouldHideDiv=false;
  isEditSectionVisible = false;
  saveForm: any;
  saveAddForm!: FormGroup;
  selectedLevel:string='';
  selectedIsSubscribed:string='';

  selectedImageSrc: string | ArrayBuffer | null | undefined;

  isEditing!: boolean;
  visibleEditSection!: boolean;
  visibleAddSection!: boolean;
  chatMessage!: boolean;
  value: any;
  zoneTypes: any = [];
  submitted!: boolean;
  messages: any;
  attachfile: any;
  typeshouldHideDiv=false;
  zoneId:string='';


  zones:any[]=[];
  isDivVisible: boolean = false;
  beacons:any[]=[];


  constructor(private apiService: ApiService,private router : Router, private formBuilder: FormBuilder, private dialog: MatDialog,private http:HttpClient) {
    this.saveForm = this.formBuilder.group({
      serialNumber: [{ value: '',  }, Validators.required],


    });

   }

  ngAfterViewInit(): void {

  }
  ngOnInit(): void {
    this.getBeaconList();
    this.getZoneTypes();
     this.saveAddForm = this.formBuilder.group({
       serialNumber: ['', Validators.required],
       zoneId:[localStorage.getItem('zoneId')]
     });
   }
   getZoneTypes(){
     this.apiService.get('cms/zonetypes').subscribe((obj  : any) => {

      if(obj){
        this.zoneTypes = obj.data;
      }
     }, error => {


     })
   }

  addAdvertisement(){
    this.visibleAddSection = !this.visibleEditSection



  }

  applyFilter1() {
    // Check if the selected level is "Reset"
    if (this.selectedLevel === 'reset') {
      // If "Reset" is selected, clear the filter
      this.dataSource.filter = '';
    } else {
      // If any other option is selected
      const selectedNumericValue = parseInt(this.selectedLevel, 10);

      // Perform additional actions based on the selected value
      switch (selectedNumericValue) {
        case 1:
          // Do something for level 1
          break;
        case 2:
          // Do something for level 2
          break;
        // Add more cases as needed

        default:
          // Default action for other numeric values
          this.dataSource.filter = this.selectedLevel.trim().toLowerCase();
          break;
      }
    }
  }


  applyFilter2(){
    // Check if the selected level is "Reset"
    if (this.selectedLevel === '4') {
      // If "Reset" is selected, clear the filter
      this.dataSource.filter = '';
    }
    else{
      this.dataSource.filter = this.selectedIsSubscribed.trim();
    }

    // console.log( this.selectedIsSubscribed.trim().toLowerCase());
  }

  loadZones(){


    let id_user : id_user = this.apiService.getlocalstorageId();
    this.apiService.get('cms/zones?merchantId='+id_user.merchantId+'&outletId='+id_user.outletId).subscribe((result:any)=>{
    this.zones=result.data;
    console.log(this.zones);

    });

  }
  getBeaconById(event: any): void {
    const selectedValue = event.target.value;
    console.log('Selected value:', selectedValue);

    this.apiService.get('cms/zone/' + selectedValue).subscribe((result: any) => {
      this.beacons = result.data;
      console.log(this.beacons);
      if(this.beacons[0].beacons[0]==null){
        this.shouldHideDiv = true;
      }
      else{
        this.shouldHideDiv = false;
      }
    });



  }
  backButton(){
    this.router.navigate(['dashboard/zones-beacons/view_zones']);

  }
  onAddSubmit(form : any){
    this.submitted = true;
     if(form.invalid){
       const dialogRef = this.dialog.open(DialogComponent, {
        disableClose: false,
        width: "300px",
        data: {
          type : 'warn',
          message: "Please fill all the mandatory fields",
          btnClose: "OK"
        }
      });
     }else{
     this.apiService.post('cms/beacon' , this.saveAddForm.value).subscribe((obj  : any) => {
      const dialogRef = this.dialog.open(DialogComponent, {
        disableClose: false,
        width: "auto",
        data: {
          type : 'success',
          message: this.saveAddForm.value.serialNumber+" created successfully",

          btnClose: "OK"
        }
      });
      dialogRef.afterClosed().subscribe(date => {
        console.log('The dialog was closed');
        // Reload the page or navigate to the current route
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([this.router.url]);        });
    }, error => {


    })
    }
  }


  extractDropdownOptions() {
    this.dropdownOptions = this.displayedColumns;
  }

  // for edit section

  editBeacons(row : any){
    this.visibleEditSection = !this.visibleEditSection
    localStorage.setItem('zone' , JSON.stringify(row));
    // this.router.navigate(['/dashboard/zones-beacons/edit']);

    this.value = row;

    // Use patchValue to populate the form fields with the selected brand's data
    this.saveForm.patchValue({
      serialNumber: row.serialNumber,


      // ... Other form fields
    });
    this.saveForm.enable();
  }

  onSubmit(form : any){


    this.submitted = true;
    let id_user: id_user = this.apiService.getlocalstorageId();


     this.apiService.put('cms/beacon/'+this.value.beaconId, this.saveForm.value).subscribe((obj  : any)   => {

      const dialogRef = this.dialog.open(DialogComponent, {
        disableClose: false,
        width: "300px",
        data: {
          type : 'success',
          message: this.saveForm.value.serialNumber+" updated successfully",
          btnClose: "OK"
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        // Reload the page or navigate to the current route
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([this.router.url]);
      });
      // this.router.navigateByUrl('/dashboard/zones-beacons/view');

    });

      }


  formData(arg0: string, formData: any) {
    throw new Error('Method not implemented.');
  }
  onSelectFile(event: any) {
    // let file = event.target.files[0];
    // this.attachfile = file;
    let file = event.target.files[0];
    let reader = new FileReader();
    const img = new Image();
    reader.readAsDataURL(file); // read file as data url
    img.src = window.URL.createObjectURL(file);
    reader.onload = () => {
      setTimeout(() => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src);
        console.log(width, height);

          // Set theFile property
          this.attachfile = event.target.files[0];
          this.messages = [];


      },1000);

    }
  }









  getBeaconList() {
    let id_user : id_user = this.apiService.getlocalstorageId();
    this.apiService.get('cms/zone/' + localStorage.getItem('zoneId')).subscribe((obj: any) => {
      if (obj) {
        let filteredData: any = [];
        if (obj.data instanceof Array) {
          obj.data.forEach((element: any) => {
            if (element.beacons.length > 0) {
              element.beacons.forEach((data: any) => {
                data.zoneName = element.zoneName;
                data.zoneType = element.zoneType;
                filteredData.push(data);
              });
            }
          });
        }
        this.dataSource = new MatTableDataSource(filteredData);

      }
    }, error => {
      console.log(error)

    })
  }


  closeChatBox() {
    this.visibleEditSection = false;

  }
  closeAddChatBox() {
    this.visibleAddSection = false;

  }
  refreshPage() {
    window.location.reload();
  }
  applyFilter(filterValue: any) {
    if(filterValue.value){
    let val = filterValue.value;
    val = val.trim(); // Remove whitespace
    val = val.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = val;}
  }
  deleteBeacons(row : any)
  {

    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: false,
      width: "300px",
      data: {
        type : 'warn',
        message: "Are you sure want to delete ",
        btnYes: "Yes",
        btnNo : "No"
      }
    });
    dialogRef.afterClosed().subscribe(result=>{
      if(result == 'yes'){
        let id_user : id_user = this.apiService.getlocalstorageId();
    this.apiService.delete('cms/beacon/'+row.beaconId).subscribe((obj: any) =>{
          const dialogRef = this.dialog.open(DialogComponent, {
            disableClose: false,
            width: "300px",
            data: {
              type : 'success',
              message: row.serialNumber+'deleted Successfully',
              btnClose: "Ok"
            }
          });
          dialogRef.afterClosed().subscribe((data:any)=>{
            this.ngOnInit();
          })
        }, error => {
          console.log(error)

        });
      }
    })


  }
}