import React from "react"
import Main from "./Main"
import GlobalStyles from "./GlobalStyles"
import Header from "./Header"

import vaccinationServices from "./vaccinationServices"
import vaccinationRecommendations from "./vaccinationRecommendations.json"
import vaccinationsMade from "./vaccinationsMade.json"
//non-mandatory vaccinations are optional depending on your history. medical advice is required
const user = {
  age: "2019 09 24"
}

function App() {
  const vaccinationsDue = vaccinationServices(
    user.age,
    vaccinationsMade,
    vaccinationRecommendations
  )
  return (
    <div className="App">
      <>
        <GlobalStyles></GlobalStyles>
        <Header></Header>
        <Main data={vaccinationsDue}></Main>
      </>
    </div>
  )
}

export default App
