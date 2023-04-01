    import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
    import { UserService } from "../../../services/user-service/user.service";
    import { Router } from "@angular/router";
    import { FormBuilder, FormGroup, Validators } from "@angular/forms";
    import { Zaposleni, Page, DeparmentShort, HospitalShort } from "../../../models/models";
    import { NgxPaginationModule } from 'ngx-pagination';

    @Component({
    selector: 'app-admin-search-employee',
    templateUrl: './admin-search-employee.component.html',
    styleUrls: ['./admin-search-employee.component.css']
    })

    export class AdminSearchEmployeeComponent implements OnInit {

    @NgModule({
        imports: [NgxPaginationModule]
    })

    // Pagination properties
    PAGE_SIZE: number = 5;

    page: number = 0;
    total: number = 0;

    deleted: boolean = false;
    searchForm: FormGroup
    routerUpper: Router
    public selektovanaOrdinacija: string = '';
    public selektovanaBolnica: string = '';
    public ime: string = '';
    public prezime: string = '';
    userPage: Page<Zaposleni> = new Page<Zaposleni>();
    userList: Zaposleni[] = []
    departments: DeparmentShort[] = []
    hospitals: HospitalShort[] = []


    constructor(private userService: UserService, private router: Router, private formBuilder: FormBuilder) {
        this.routerUpper = router
        this.searchForm = this.formBuilder.group({
            ime: '',
            prezime: '',
            selektovanaOrdinacija: '',
            selektovanaBolnica: '',
            deleted: false
        });
    }

    ngOnInit(): void {
        // Populate departments
        this.userService.getDepartments().subscribe((response) => {
            this.departments = response
        })

        // Populate hospitals
        this.userService.getHospitals().subscribe((response) => {
            this.hospitals = response
        })

        // Get all users
        this.userService.getAllUsers(this.ime, this.prezime, this.selektovanaOrdinacija, this.selektovanaBolnica, this.deleted, this.page, this.PAGE_SIZE).subscribe((response) => {
            this.userPage = response;
            this.userList = this.userPage.content
            this.total = this.userPage.totalElements
        })
    }

    search(): void {
        this.getUserList();
    }

    goToEditPage(zaposleni: Zaposleni): void {
        this.router.navigate(['/admin-edit-employee/', zaposleni.lbz]);
    }

    deleteUser(LBZ: string): void {
        if (confirm("Da li ste sigurni da zelite da obrisite zaposlenog " + LBZ + "?")) {
            this.userService.deleteUser(
                LBZ
            ).subscribe(response => {
                    this.getUserList()
                }
            )
        }
    }

    getUserList(): void {
        if (this.selektovanaOrdinacija == "Odaberite odeljenje")
            this.selektovanaOrdinacija = ""
        if (this.selektovanaBolnica == "Odaberite bolnicu")
            this.selektovanaBolnica = ""
        if(this.page == 0)
            this.page = 1;

        this.userService.getAllUsers(this.ime, this.prezime, this.selektovanaOrdinacija, this.selektovanaBolnica, this.deleted, this.page-1, this.PAGE_SIZE).subscribe((response) => {
            this.userPage = response;
            this.userList = this.userPage.content;
            this.total = this.userPage.totalElements
        });
    }

    onTableDataChange(event: any): void {
        this.page = event;
        this.getUserList();
    }
}
