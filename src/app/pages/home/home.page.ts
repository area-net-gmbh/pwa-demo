import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { SwUpdate } from '@angular/service-worker';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Plugins } from '@capacitor/core';
import { TodoStoreService } from '../../services/todo-store.service';
import { Todo } from '../../interfaces/todo.interface';
const { LocalNotifications } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  code = '';
  deferredPrompt: any = null;
  message = '';
  showBannerButton = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private swUpdate: SwUpdate,
    private storage: Storage,
    private toasCtrl: ToastController,
    public todoStore: TodoStoreService
  ) {
  }

  ionViewWillEnter(){
    this.message = '';
  }

  ionViewDidEnter(){
    this.swUpdate.available.subscribe(u => {
      this.message = 'Update available';
      this.swUpdate.activateUpdate().then(e => {
        this.message = 'Update installable';
        this.presentToast();
      });
    });

    this.message = '';

    setTimeout(() => {
      this.message = 'checkForUpdate()';
    }, 1000);
    this.swUpdate.checkForUpdate();

    /*Notification.requestPermission((result) => {
      this.showNotification();
    });*/

    //this.todoStore.fetchAll();
  }

  /*async showNotification(){
    const notifs = await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Neuer Termin',
          body: 'Es ist ein neuer Termin vorhanden.',
          id: 1,
          schedule: {every: 'minute'},
          sound: null,
          attachments: null,
          actionTypeId: '',
          extra: null
        }
      ]
    });
    console.log('scheduled notifications', notifs);
  }*/

  ngOnInit(){

    this.code = this.route.snapshot.paramMap.get('code');
    this.todoStore.fetchAll();

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showBannerButton = true;
    });
  }

  enableBackgroundSync(){
    Notification.requestPermission((result) => {
      if (result === 'granted') {
        console.log('Notification.requestPermission');
        this.registerPeriodicSync();
      }
    });
  }

  async registerPeriodicSync(){
    const registration = await navigator.serviceWorker.ready;
    if ('periodicSync' in registration) {
      const status = await navigator.permissions.query({
        name: ('periodic-background-sync' as any),
      });
      if (status.state === 'granted') {
       console.log('periodic-background-sync granted');
      } else {
        console.log('periodic-background-sync not granted');
      }
      try {
        console.log('registerPeriodicSync 1 day');
        await (registration as any).periodicSync.register('todo-reminder', {
          // An interval of one day.
          minInterval: 1000 * 60 * 60 * 24,
        });

        const tags = await (registration as any).periodicSync.getTags();
        if (tags.includes('todo-reminder')) {
          console.log('registerPeriodicSync registered 1 day');
        }else{
          console.log('registerPeriodicSync not registered 1 day');
        }

      } catch (error) {
        console.log('registerPeriodicSync failed', error);
      }
    }
  }

  async presentToast() {
    const toast = await this.toasCtrl.create({
      message: 'Ein Update der Seite ist verfügbar.',
      buttons: [
        {
          text: 'Seite neu laden',
          role: 'cancel',
          handler: () => {
            location.reload();
          }
        }
      ]
    });
    toast.present();
  }

  openFom(todo: Todo = null){
    if (todo != null){
      this.navCtrl.navigateForward('form/' + todo.id);
    }else{
      this.navCtrl.navigateForward('form');
    }
  }

  showPrompt(){
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
      });
  }

}



