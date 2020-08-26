import { Injectable } from '@angular/core';
import { openDB } from 'idb';
import { Todo } from '../interfaces/todo.interface';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoStoreService {

  private db;

  current$: Observable<Todo>;
  todos$: Observable<Todo[]>;
  private todos: BehaviorSubject<Todo[]> = new BehaviorSubject([]);
  private current: BehaviorSubject<Todo> = new BehaviorSubject(null);

  constructor() {
    this.todos$   = this.todos.asObservable();
   }

  private async open(){
    if (!this.db){ 
      this.db = await openDB('todos', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('todos')) {
            db.createObjectStore('todos', {keyPath: 'id', autoIncrement: true});
          }
        },
      });
    }
    return Promise.resolve(this.db);
  }

  delete(todo: Todo){
    return this.open().then((db) => {
      const tx = db.transaction('todos', 'readwrite');
      tx.objectStore('todos').delete(todo.id);
      return tx.complete;
    }).then(() => {
      this.fetchAll();
      return Promise.resolve();
    });
  }

  put(todo: Todo){
    return this.open().then((db) => {
      const tx = db.transaction('todos', 'readwrite');
      tx.objectStore('todos').put(todo);
      return tx.complete;
    }).then(() => {
      this.fetchAll();
      return Promise.resolve();
    });
  }

  get(id){
    return this.open().then((db) => {
      const store    = db.transaction('todos', 'readonly').objectStore('todos');
      return store.get(parseInt(id)).then((todo) => {
        return todo;
      });
    });
  }

  fetchAll(){
    this.open().then((db) => {
      const tx    = db.transaction(['todos'], 'readonly');
      const store = tx.objectStore('todos');
      return store.getAll();
    }).then((todos) => {
      this.todos.next(todos);
    });
  }
}
