import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';

// Mis imports
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {


  @Input() position = 'normal';

  user = { name: '', picture: 'assets/images/user.png' };

  /*userMenu = [{ title: 'Profile' }, { title: 'Log out' }];*/
   userMenu = [{ title: 'Log out' }];
   menu = [{ title: 'Profile' }, { title: 'Log out' }];

   items = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private analyticsService: AnalyticsService,
              private router: Router) {
  }

  ngOnInit() {
    /*this.userService.getUsers()
      .subscribe((users: any) => this.user = users.nick);*/

      this.user.name = localStorage.getItem('mouvers_user_nombre');
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  goToHome() {
    //this.menuService.navigateHome();
    this.router.navigateByUrl('/pages');
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }

  onMenuClick($event){
    if ($event.title == 'Log out') {
      this.salir();
    }

    
  }

  salir() {
    localStorage.removeItem('mouvers_token');
    localStorage.removeItem('mouvers_user_id');
    localStorage.removeItem('mouvers_user_nombre');
    localStorage.removeItem('mouvers_user_tipo');

    this.router.navigateByUrl('/pagessimples/loginf');
  }
}
