import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { db,} from "../db/db"
import type {OfflineTodo} from "../db/db"


function fetchTodos(): Promise<OfflineTodo[]> {
  return fetch('https://jsonplaceholder.typicode.com/todos')
    .then((res) => res.json())
    .catch(async () => {

      // If offline, return Dexie stored todos
      return db.todos.toArray();

    });

}

function TodoList(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'incomplete'>('all');

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<OfflineTodo[]>({
    queryKey: ['todos'],
    queryFn: fetchTodos,

  });

  // Offline sync effect: push unsynced todos when online

  useEffect(() => {
    const syncTodos = async () => {
      const unsynced = await db.todos.where('isSynced').equals(false).toArray();
      for (const todo of unsynced) {

        try {
          await fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            body: JSON.stringify(todo),
            headers: { 'Content-Type': 'application/json' },
          });

          await db.todos.update(todo.id!, { isSynced: true });

        } catch (err) {
          console.log('Still offline, will retry later.');
        }

      }

    };


    window.addEventListener('online', syncTodos);
    return () => window.removeEventListener('online', syncTodos);

  }, []);


  // Delete mutation (works offline)

  const deleteTodoMutation = useMutation({

    mutationFn: async (id: number) => {

      try {
        await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, { method: 'DELETE' });
      } catch {

        await db.todos.delete(id); 

      }

    },

    onSuccess: () => {

      queryClient.invalidateQueries(['todos']);

      toast.success('Todo Deleted Successfully');

    },

  });



  // Filtering and pagination logic same as before

  const handleFilterChange = (status: 'all' | 'completed' | 'incomplete') => {

    setFilterStatus(status);

    setCurrentPage(1);

  };



  const filteredTodos = data?.filter((todo) => {

    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =

      filterStatus === 'all' ||

      (filterStatus === 'completed' && todo.completed) ||

      (filterStatus === 'incomplete' && !todo.completed);

    return matchesSearch && matchesStatus;

  });



  const indexOfLastTodo = currentPage * todosPerPage;

  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;

  const currentTodos = filteredTodos?.slice(indexOfFirstTodo, indexOfLastTodo);



  if (isLoading) return <p>Loading todos...</p>;

  if (isError) return <p>Error loading todos</p>;


 return (

    <main>

      <header>

        <h1 className="Header">All Todos</h1>

      </header>
<div className='todo-container'>
      <button className="search">
        <input
          type="text"

          placeholder="Search by title"

          value={searchTerm}

          onChange={(e) => setSearchTerm(e.target.value)}

        />

      </button>



      <div className="filterbtn">

        <button className="allbtn" onClick={() => handleFilterChange('all')}>

          All

        </button>

        <button className="completebtn" onClick={() => handleFilterChange('completed')}>

          Completed

        </button>

        <button className="incompletebtn" onClick={() => handleFilterChange('incomplete')}>

          Incomplete

        </button>

      </div>



      <ul className="todo-list">

        {filteredTodos?.length === 0 ? (

          <p>No matching todos found</p>

        ) : (

          currentTodos?.map((todo) => (

            <li key={todo.id}>

              <div className="link">

                <h3>{todo.title}</h3>

                <Link to={`/todo/${todo.id}`}>View Details</Link>

              </div>



              <div className="buttons">

                <button

                  onClick={() => {

                    const confirmDelete = window.confirm(

                      'Are you sure you want to delete this todo?'

                    );

                    if (confirmDelete) deleteTodoMutation.mutate(todo.id);

                  }}

                  className="delete"

                >

                  Delete

                </button>



                <button

                  className="edit"

                  onClick={() =>

                    updateMutation.mutate({

                      id: todo.id,

                      updated: { ...todo, title: todo.title + ' (Updated)' },

                    })

                  }

                >

                  Edit Todo

                </button>

              </div>

            </li>

          ))

        )}

      </ul>



      <div className="pagination-control">

        <button

          className="prev"

          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}

          disabled={currentPage === 1}

        >

          Prev

        </button>



        <span className="page">Page {currentPage}</span>



        <button

          className="next"

          onClick={() => {

            const totalPages = Math.ceil((filteredTodos?.length || 0) / todosPerPage);

            setCurrentPage((prev) => Math.min(prev + 1, totalPages));

          }}

          disabled={indexOfLastTodo >= (filteredTodos?.length || 0)}

        >

          Next

        </button>

      </div>
</div>
    </main>
    

  );

}



export default TodoList;