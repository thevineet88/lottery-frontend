import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {

  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: '',
    winner: ''
  };

async componentDidMount() {
  const manager = await lottery.methods.manager().call();
  const players = await lottery.methods.getPlayers().call();
  const balance = await web3.eth.getBalance(lottery.options.address);

  this.setState({ manager: manager, players: players, balance: balance});
}

 onSubmit = async (event) => {
  event.preventDefault();

  const accounts = await web3.eth.getAccounts();

  this.setState( {message: 'Please wait we are addinng you.......'} );

  await lottery.methods.enter().send({
    from: accounts[0],
    value: web3.utils.toWei(this.state.value,'ether')
  })

  this.setState( {message: 'You have been entered!!'} );
}

onClick = async () => {

  const accounts = await web3.eth.getAccounts();

  this.setState( {message: 'Please wait we are picking a winner.........'} );

  await lottery.methods.pickWinner().send({
    from: accounts[0]
  });

  this.setState( {message: 'Congratz..Winner has been picked !'} );

  const winner = await lottery.methods.winner().call();
  this.setState( { winner: 'Winner of the lottery is : ' + winner} );

}

  render() {
    return (
      <div class="lottery-mainBlock">
        <h1> Welcome to Ethereum Lottery Contract </h1>
        <h3> The Manager of the contract is {this.state.manager} </h3>
        <p>
        Currently, there are {this.state.players.length} players in the contract, competing
        for the prize pool of {web3.utils.fromWei(this.state.balance,'ether')} ether.
        </p>
        <hr />
        <div>
        <form onSubmit={this.onSubmit}>
          <h1> Wanna try your luck ? </h1>
          <label> Amount of ether to enter the lottery </label>
          <input
            value = {this.state.value}
            onChange = {event => this.setState({value: event.target.value})}
          />
          <br />
          <button>Enter</button>
        </form>
        <hr />
        <h3>{ this.state.message }</h3>
        </div>
        <h3> Pick a Winner ? </h3>
        <button onClick={this.onClick}>Pick</button>
        <hr />
        <h3>{ this.state.winner }</h3>
      </div>
    );
  }
}
export default App;
