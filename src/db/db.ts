import Dexie from 'dexie';

export interface OfflineTodo {
  id?: number; 
  userId: number;
  title: string;
  completed: boolean;
  isSynced: boolean;
}

export class TodoDB extends Dexie {
  todos: Dexie.Table<OfflineTodo, number>;

  constructor() {
    super('TodoDatabase');
    this.version(1).stores({
      todos: '++id, title, completed, isSynced',
    });
    this.todos = this.table('todos');
  }
}

export const db = new TodoDB();