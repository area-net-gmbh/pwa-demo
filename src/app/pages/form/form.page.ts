import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TodoStoreService } from '../../services/todo-store.service';
import { Todo } from '../../interfaces/todo.interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {

  customPickerOption = {
    buttons: [
      {
        text: 'Abbrechen',
        handler: () => {
          return true;
        }
      },
      {
        text: 'Löschen',
        handler: () => {
          this.todo.date = null;
          return true;
        }
      },
      {
        text: 'SPEICHERN',
        handler: (x) => {
          const date = new Date();
          date.setDate(x.day.value);
          date.setMonth(x.month.value - 1);
          date.setFullYear(x.year.value);
          this.todo.date = date.toISOString();
          return true;
        }
      }
    ]};
  todo: Todo  = {name: ''};

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private todoStore: TodoStoreService
  ) { }

  delete(){
    this.todoStore.delete(this.todo).then(() => {
      this.navCtrl.pop();
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id != null){
      this.todoStore.get(id).then((todo) => {
        this.todo = todo;
      });
    }
  }

  save(){
    if (this.todo.name){
      this.todoStore.put(this.todo).then(() => {
        this.navCtrl.pop();
      });
    }
  }

}
