import { Link } from 'react-router-dom';



const NotFound = () => {

  return (

    <main>

      <section>

        <div className="not-found">

          <h1 className="Sorry">404 - Page</h1>

          <p>Sorry! The page you are looking for does not exist!</p>

          <Link to="/">Back to the homepage...</Link>

        </div>

      </section>

    </main>

  );

};



export default NotFound;

