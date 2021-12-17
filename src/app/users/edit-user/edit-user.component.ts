import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  userId: any;
  userDetails: any;
  editUserForm: FormGroup = new FormGroup({});
  dataLoaded: boolean = false;


  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private fb:  FormBuilder,
              private router: Router,
              private _snackBar: MatSnackBar
              ) { }

  ngOnInit(): void {
    this.dataLoaded = false;
    this.activatedRoute.params.subscribe(data => {
      this.userId = data.id;
    })

    if(this.userId !== '') {
      //kullanıcı bilgilerini göstermek için
      this.userService.viewUser(this.userId)
      .toPromise()
      .then(data => {
        this.userDetails = data;
        Object.assign(this.userDetails, data);
        console.log(this.userDetails);

        //edit formumuz için
        this.editUserForm = this.fb.group({
          'username': new FormControl(this.userDetails.name),
          'email': new FormControl(this.userDetails.email)
        })
        this.dataLoaded = true;
      })
      .catch( err => {
        console.log(err);
      })
    }
  }

  updateUser() {
    this.userService.editUser(this.userId, this.editUserForm.value).subscribe( data => {
      this._snackBar.open("Kullanıcı güncellendi.")
    }, err => {
      this._snackBar.open("Kullanıcı güncellenemedi.")
    });
    this.router.navigate(['users']);
  }

}
