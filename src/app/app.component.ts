import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { SwUpdate, SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  readonly VAPID_PUBLIC_KEY = 'BM4XSgL4D4K432VU1CKGkatD5NCp7bGtZolrqkrACW8ILkfmGBLuhwA7PhCk6zsYl9v7Wt7pRuhUk2ONUnuoD48';

  constructor(
    private platform: Platform,
    private swPush: SwPush
  ) {
  }


}
