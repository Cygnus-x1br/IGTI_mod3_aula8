import React, { Component } from 'react';
import Countries from './components/countries/Countries';
import Header from './components/header/Header';

export default class App extends Component {
  constructor() {
    super();
    /*No React não podemos deixar nenhum campo como null nem undefined. O array
    allCountries armazena todos os dados que o componentDidMount recebe do link
    externo para evitar requisições externas. Criamos o array filteredCountries
    que será o vetor que armazenará as alterações conforme requisitado, ou seja
    o array allCountries mantém os dados requisitados e o array que fica processando
    as alterações é o filteredCountries.*/

    this.state = {
      allCountries: [],
      filteredCountries: [],
      filteredPopulation: 0,
      filter: '',
    };
  }

  async componentDidMount() {
    const res = await fetch('https://restcountries.eu/rest/v2/all');
    const json = await res.json();

    /*Fazendo o destructuring diretamente sem utilizar a atribuição de variável*/

    const allCountries = json.map(({ name, numericCode, flag, population }) => {
      return {
        id: numericCode,
        name,
        filterName: name.toLowerCase(),
        flag,
        population,
      };
    });

    const filteredPopulation = this.calculateTotalPopulationFrom(allCountries);

    //console.log(json);
    this.setState({
      /*Podemos omitir a identificação do objeto quando ele é igual como neste caso
      allCountries: allCountries,*/
      allCountries,
      filteredCountries: allCountries,
      filteredPopulation,
    });
  }

  calculateTotalPopulationFrom = (countries) => {
    const totalPopulation = countries.reduce((accumulator, current) => {
      return accumulator + current.population;
    }, 0);
    return totalPopulation;
  };
  handleChangeFilter = (newText) => {
    //console.log(newText);

    this.setState({
      filter: newText,
    });

    const filterLowerCase = newText.toLowerCase();

    //console.log(filterLowerCase);

    const filteredCountries = this.state.allCountries.filter((country) => {
      return country.filterName.includes(filterLowerCase);
    });
    //console.log(this.state.allCountries);

    const filteredPopulation = this.calculateTotalPopulationFrom(
      filteredCountries
    );

    this.setState({
      filteredCountries,
      filteredPopulation,
    });
  };
  render() {
    const { filteredCountries, filter, filteredPopulation } = this.state;

    //console.log(allCountries);

    return (
      <div className="container">
        <h1>React Countries</h1>
        <Header
          filter={filter}
          countryCount={filteredCountries.length}
          totalPopulation={filteredPopulation}
          onChangeFilter={this.handleChangeFilter}
        />
        <Countries countries={filteredCountries} />
      </div>
    );
  }
}
