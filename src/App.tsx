import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TodoList from './Components/TodoList';
import CreateTodo from './Components/CreateTodo';
import NotFound from './Components/NotFound';
import Home from './Components/Home';
import TodoDetails from './Components/TodoDetails';



function App(): JSX.Element {

  return (

    <>

      <Router>

        <div className="App">

          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/todos" element={<TodoList />} />

            <Route path="/create" element={<CreateTodo />} />

            <Route path="/create/:id" element={<CreateTodo />} />

            <Route path="/todo/:id" element={<TodoDetails />} />

            <Route path="*" element={<NotFound />} />

          </Routes>

        </div>

      </Router>


    </>

  );

}



export default App;