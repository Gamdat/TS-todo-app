import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { db} from "../db/db";
import type {OfflineTodo} from "../db/db"


function CreateTodo(){

  const [title, setTitle] = useState('');

  const queryClient = useQueryClient();



  const addTodoMutation = useMutation({

    mutationFn: async (newTodo: OfflineTodo) => {

      try {

        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {

          method: 'POST',

          body: JSON.stringify(newTodo),

          headers: { 'Content-Type': 'application/json' },

        });

        const data = await response.json();

        return data;

      } catch (error) {

        // If offline, save to Dexie

        await db.todos.add({ ...newTodo, isSynced: false });

        return newTodo;

      }

    },

    onSuccess: () => {

      queryClient.invalidateQueries(['todos']);

      setTitle('');

      toast.success('Todo Created Successfully (offline if needed)');

    },

  });



  const handleSubmit = () => {

    if (!title.trim()) return;



    const newTodo: OfflineTodo = {

      userId: 1,

      title,

      completed: false,

      isSynced: true,

    };



    addTodoMutation.mutate(newTodo);

  };



  return (

    <div className="add-todo">

      <input

        value={title}

        onChange={(e) => setTitle(e.target.value)}

        type="text"

        placeholder="Enter your todo"

      />

      <button onClick={handleSubmit} className="Add">

        Add Todo

      </button>

    </div>

  );

}



export default CreateTodo;



