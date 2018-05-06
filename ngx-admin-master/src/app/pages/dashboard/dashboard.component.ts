import { Component } from '@angular/core';

// Mis imports
import { NbSpinnerService, NbThemeService } from '@nebular/theme';
import { NbJSThemeOptions } from '@nebular/theme/services/js-themes/theme.options';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

	items = [{ title: 'Profile' }, { title: 'Log out' }];
	
	constructor(public themeService:NbThemeService){

	}

	ngOnInit() {
		//this.themeService.changeTheme('cosmic');
		this.themeService.changeTheme('default');
	}
}
