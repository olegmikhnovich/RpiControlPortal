import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  version = '1.0.0';
  rpiRepo = 'https://github.com/olegmikhnovich/RpiControl';
  rpiRepoPortal = 'https://github.com/olegmikhnovich/RpiControlPortal';
  rpiRepoDash = 'https://github.com/olegmikhnovich/RpiControlDashboard';

  openLink(link: string) {
    window.open(link, '_blank');
  }
}
