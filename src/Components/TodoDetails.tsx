import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';


interface Todo {

  id: number;

  userId: number;

  title: string;

  completed: boolean;

}



const TodoDetails = () => {

  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();



  const { data: todo, isLoading, isError } = useQuery<Todo>({

    queryKey: ['todo', id],

    queryFn: () =>

      axios

        .get(`https://jsonplaceholder.typicode.com/todos/${id}`)

        .then((res) => res.data),

  });



  if (isLoading) return <p>Loading todo details...</p>;

  if (isError || !todo) return <p>Error fetching todo details</p>;



  return (

    <section>

      <div className="todo-details">

        <h2>Todo Details</h2>

        <p>

          <strong>ID:</strong> {todo.id}

        </p>

        <p>

          <strong>Title:</strong> {todo.title}

        </p>

        <p>

          <strong>Status:</strong> {todo.completed ? 'Completed' : 'Not Completed'}

        </p>

        <button onClick={() => navigate(-1)} className="back-button">

          Back to List

        </button>

      </div>

    </section>

  );

};



export default TodoDetails;



