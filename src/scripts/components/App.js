require ('../../assets/stylesheets/app.scss');

import React        from 'react';

import Room         from '../components/Room';
import Input        from '../components/Input';
import Output       from '../components/Output';
import TileStore    from '../stores/TileStore';

const App = React.createClass({

  render (){
    return (
    <div>
      <header>
        <h1 className="app__title">Reactic Hoover</h1>
      </header>
      <Input/>
      <Room/>
      <Output/>
    </div>
    );
  }
});

export default App;
