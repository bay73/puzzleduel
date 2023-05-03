function leagueSettings(theme) {

  let leagueSettings = {}

  leagueSettings["3bxc1wolfgm8dof"] = {
    index: 1,
    name: "Red League",
    top: 3,
    bottom: 15,
    topStyle: theme=='white'?'color: #D2A;':'color: #F7A;',
    mainStyle: theme=='white'?'color: #D55;':'color: #FAA',
    bottomStyle: theme=='white'?'color: #D92;':'color: #FA3;',
    markerStyle: theme=='white'?'background-color: #E55;':'background-color: #F66',
    next: '3bxc1wolfgm8dpe'
  }

  leagueSettings["3bxc1wolfgm8dpe"] = {
    index: 2,
    name: "Orange League",
    top: 5,
    bottom: 23,
    topStyle: theme=='white'?'color: #D55;':'color: #FAA',
    mainStyle: theme=='white'?'color: #D92;':'color: #FA3;',
    bottomStyle: theme=='white'?'color: #BB3;':'color: #DD4;',
    markerStyle: theme=='white'?'background-color: #D92;':'background-color: #FA3;',
    prev: '3bxc1wolfgm8dof',
    next: '3bxc1wolfgm8dqf'
  }
  leagueSettings["3bxc1wolfgm8dqf"] = {
    index: 3,
    name: "Yellow League",
    top: 7,
    bottom: 30,
    topStyle: theme=='white'?'color: #D92;':'color: #FA3;',
    mainStyle: theme=='white'?'color: #AA0;':'color: #DD0;',
    bottomStyle: theme=='white'?'color: #4A0;':'color: #9D0;',
    markerStyle: theme=='white'?'background-color: #DD0;':'background-color: #FF0;',
    prev: '3bxc1wolfgm8dpe',
    next: '3bxc1wolfgm8dr8'
  }
  leagueSettings["3bxc1wolfgm8dr8"] = {
    index: 4,
    name: "Green League",
    top: 10,
    bottom: 40,
    topStyle: theme=='white'?'color: #AA0;':'color: #DD0;',
    mainStyle: theme=='white'?'color: #4B0;':'color: #9D0;',
    bottomStyle: theme=='white'?'color: #188;':'color: #3AA;',
    markerStyle: theme=='white'?'background-color: #2C0;':'background-color: #6D0;',
    prev: '3bxc1wolfgm8dqf',
    next: '3bxc1wolfgm8ds3'
  }

  leagueSettings["3bxc1wolfgm8ds3"] = {
    index: 5,
    name: "Blue League",
    top: 10,
    bottom: 50,
    topStyle: theme=='white'?'color: #188;':'color: #3AA;',
    mainStyle: theme=='white'?'color: #17A;':'color: #39E;',
    bottomStyle: theme=='white'?'color: #17A;':'color: #39E;',
    markerStyle: theme=='white'?'background-color: #17C;':'background-color: #39E;',
    prev: '3bxc1wolfgm8dr8'
  }

  leagueSettings["3bxc1wolfgm8dt6"] = {
    index: 6,
    name: "Indigo League",
    top: 10,
    bottom: 60,
    topStyle: 'color: DodgerBlue;',
    mainStyle: 'color: Indigo;',
    bottomStyle: 'color: Violet;',
    markerStyle: 'background-color: Indigo;',
  }

  leagueSettings["3bxc1wolfgm8du0"] = {
    index: 7,
    name: "Violet League",
    top: 10,
    bottom: 70,
    topStyle: 'color: Indigo;',
    mainStyle: 'color: Violet;',
    bottomStyle: 'color: Grey;',
    markerStyle: 'background-color: Violet;',
  }

  return leagueSettings
}

module.exports = leagueSettings