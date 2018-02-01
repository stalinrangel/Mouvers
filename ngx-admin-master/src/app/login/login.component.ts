import { Component, OnInit } from '@angular/core';
import { NbSpinnerService, NbThemeService } from '@nebular/theme';
import { NbJSThemeOptions } from '@nebular/theme/services/js-themes/theme.options';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-login',
  styleUrls: ['./login.scss'],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  theme: NbJSThemeOptions;

	constructor(public nbspinnerservice:NbSpinnerService,public themeService:NbThemeService, private router: Router, private route: ActivatedRoute){
		nbspinnerservice.load();
		nbspinnerservice.clear();
		//console.log(themeService.getJsTheme());
		//themeService.changeTheme('cosmic');
		//alert('asdasd');


	}
	ngOnInit() {
	    /*this.themeService.getJsTheme()
	      .subscribe((theme: NbJSThemeOptions) => this.theme = theme;
	      	console.log(this.theme));*/
	  }
	login(){
		
		this.router.navigateByUrl('/pages');
	}
}
