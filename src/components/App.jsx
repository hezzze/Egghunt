import "./App.scss";

export default class App extends React.Component {

  componentDidMount() {
    require('../game/Main');
  }

  render() {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td rowSpan='6'><canvas id="b2dCanvas" width="800" height="600"></canvas></td>
              <td><ul>
                  <li>Right Click in the transparent red area to create an angry
                    bird !!!!</li>
                  <li>Click or drag on the ice to cut it!!!!</li>
                  <li>Crash into as many as easter bunny as possible!!!</li>
                </ul></td>
            </tr>
            <tr>
              <td id="levelLabel" style={{font: '20px times new roman, sans serif'}}>LEVEL 1</td>
            </tr>
            <tr>
              <td id='nextLevel'><button>Next level</button></td>

            </tr>
            <tr>
              <td id='restartLevel'><button>Restart level</button></td>
            </tr>
            <tr>
              <td></td>
            </tr>
          </tbody>
        </table>

        <div id="level-dialog" title='Mission Completed!'>You made it!!!</div>
      </div>
    );
  }
}
