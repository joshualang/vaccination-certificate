const vaccinationRecommendations = require('./vaccinationRecommendations.json')
const admin = require('firebase-admin')
let serviceAccount = require('./medical-assistant-19fc3-cee7dfd4e3aa.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})
let db = admin.firestore()

const express = require('express')
const uid = require('uid')
const cors = require('cors')

const server = express()
const port = 3334
server.listen(port, () => console.log(`Express ready on port ${port}`))
server.use(cors())
server.use(express.json())
server.set('json spaces', 2)

server.get('/api/:user', (req, res) => {
  const { user } = req.params

  db.collection('users')
    .doc(user)
    .get()
    .then(doc => {
      if (!doc.exists) {
        console.log('GET user for set', 'No such document!')
      } else {
        db.collection('users')
          .doc('LA')
          .set(nextVaccination(doc.data(), { merge: true }))
      }
    })
    .catch(err => {
      console.log('Error getting document', err)
    })
  updateVaccinationsOpen(user)
  db.collection('users')
    .doc(user)
    .get()
    .then(doc => {
      if (!doc.exists) {
        res.send('GET user', 'No such document!')
      } else {
        res.send(userFormatter(doc.data()))
      }
    })
    .catch(err => {
      res.send('Error getting document', err)
    })
})

server.patch('/api/:user', (req, res) => {
  db.collection('vaccines')
    .doc('421FbrvSm2Vc4EJsTejV')
    .get()
    .then(doc => {
      if (!doc.exists) {
        console.log('PATCH', 'No such document!')
      } else {
        const vaccine = doc.data()
        db.collection('users')
          .doc('LA')
          .set(
            {
              vaccinationsMade: [
                ...createVaccinationsMadeFromVaccine(vaccine, req),
              ],
            },
            { merge: true }
          )
      }
    })
    .catch(err => {
      console.log('Error getting document', err)
    })

  res.json('Arrived')
})

function createVaccinationsMadeFromVaccine(vaccine, request) {
  function toDateObject(reqDateString) {
    const day = Number(reqDateString.slice(0, 3))
    const month = Number(reqDateString.slice(3, 6))
    const year = Number(reqDateString.slice(6))
    return new Date(`${year}, ${month}, ${day}`)
  }

  let newVaccinations = []
  vaccine.diseases.forEach(disease => {
    console.log(disease)
    function vaccinationType() {
      const indexOfDisease = vaccinationRecommendations.findIndex(
        item => item[disease]
      )

      if (indexOfDisease >= 0) {
        console.log(indexOfDisease)
        console.log('index', vaccinationRecommendations[indexOfDisease])
        return vaccinationRecommendations[indexOfDisease][disease].find(
          entry =>
            entry.beginsAtAgeInDays <
            (toDateObject(request.body.date).getTime() -
              toDateObject(request.body.userBirth).getTime()) /
              (1000 * 60 * 60 * 24) <
            entry.endsAtAgeInDays
        ).vaccinationType
      } else {
        return 'Impfung nicht zuruordnen'
      }
    }

    newVaccinations.push({
      date: toDateObject(request.body.date),
      disease: disease,
      doctor: request.body.doctor,
      id: uid(),
      registrationNumber: request.body.sticker,
      admittedApplicant: vaccine.admittedApplicant,
      description: vaccine.description,
      furtherInformation: vaccine.furtherInformation,
      name: vaccine.name,
      registrationDate: vaccine.registrationDate,
      vaccinationType: vaccinationType(),
    })
  })
  return newVaccinations
}

function userFormatter(json) {
  function toDate(key) {
    const months = {
      1: 'Jan',
      2: 'Feb',
      3: 'Mar',
      4: 'Apr',
      5: 'May',
      6: 'Jun',
      7: 'Jul',
      8: 'Aug',
      9: 'Sep',
      10: 'Oct',
      11: 'Nov',
      12: 'Dec',
    }

    key = new Date(key._seconds * 1000)
    const date = key.getDate()
    const month = key.getMonth() + 1
    const year = key.getFullYear()
    const dateString = `${months[month]} ${date}, ${year}`

    return dateString
  }

  function getType(string) {
    const cases = {
      rotavirusG1: '1. Grundimmunisierung',
      rotavirusG2: '2. Grundimmunisierung',
      rotavirusG3: '3. Grundimmunisierung',
      rotavirusG4: '4. Grundimmunisierung',
    }
    return cases[string]
  }

  json.age = toDate(json.age)

  json.vaccinationsOpen.map(item => {
    item.vaccinationType = getType(item.vaccinationType)
    item.begins = toDate(item.begins)
  })

  json.vaccinationsMade.map(item => {
    item.vaccinationType = getType(item.vaccinationType)
    console.log('date', item.date)
    item.date = toDate(item.date)
    console.log('registrationDate', item.registrationDate)
    item.registrationDate = toDate(item.registrationDate)
  })
  return json
}

function updateVaccinationsOpen(user) {
  db.collection('user')
    .doc(user)
    .get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!')
      } else {
        db.collection('users')
          .doc('LA')
          .set(nextVaccination(doc.data(), { merge: true }))
      }
    })
    .catch(err => {
      console.log('Error getting document', err)
    })
}

function nextVaccination(data) {
  const diseaseNames = {
    rotaviren: 'Rotavirus',
    tetanus: 'Tetanus',
    diphterie: 'Diphterie',
    pertussis: 'Pertussis',
    hib: 'Hib',
    poliomyeitis: 'Polio',
    hepatitisB: 'Hepatitis B',
    pneumokokken: 'Pneumokokken',
    meningokokkenC: 'Meningokokken C',
    masern: 'Masern',
    mumps: 'Mumps, Röteln',
    varizellen: 'Varizellen',
    hpv: 'HPV',
    herpesZoster: 'Herpes Zoster',
    influenza: 'Influenza',
  }

  const birthDate = data.age._seconds * 1000
  const vaccinationsMade = data.vaccinationsMade
  const vaccinationsOpen = data.vaccinationsOpen

  function toAgeInDays(birth) {
    const now = new Date().getTime()
    console.log(now)
    return Math.floor((now - birth) / (1000 * 60 * 60 * 24))
  }
  function setDate(days) {
    const nowInMilliseconds = new Date().getTime()
    const futureInMilliseconds = days * (1000 * 60 * 60 * 24)
    const timestamp = nowInMilliseconds + futureInMilliseconds
    return new Date(timestamp)
  }

  let vaccinationsDue = []
  console.log('birthDate', birthDate)
  const userAgeInDays = toAgeInDays(birthDate)
  console.log('userAgeInDays', userAgeInDays)
  vaccinationRecommendations.forEach((disease, diseaseIndex) => {
    vaccinationsDue = [...vaccinationsDue, []]
    const diseaseName = Object.keys(disease)[0]
    const singleDisease = disease[diseaseName]
    console.log('singleDisease', diseaseName)

    singleDisease.forEach(item => {
      if (
        !vaccinationsMade.some(
          el => el.vaccinationType === item.vaccinationType
        ) &&
        userAgeInDays + 90 > item.beginsAtAgeInDays
      ) {
        console.log('vaccinationsdue bedingung')
        vaccinationsDue[diseaseIndex] = [
          ...vaccinationsDue[diseaseIndex],
          {
            id: uid(),
            disease: diseaseName,
            begins: setDate(item.beginsAtAgeInDays - userAgeInDays),
            doctor: 'Select a Doctor',
            vaccinationType: item.vaccinationType,
          },
        ]
      }
    })
  })
  console.log('before filtering', vaccinationsDue)

  const vaccinationDue = vaccinationsDue
    .map(array => array[0])
    .filter(item => item != undefined)
    .sort((a, b) => a.date - b.date)
  console.log('after filtering', vaccinationDue)
  // .map(vaccination => {
  //   vaccination.vaccinationsMade.map(entry => {
  //     Object.keys(entry).forEach(key => entry[key] === undefined && delete entry[key])
  //   })
  //   vaccination.vaccinationsOpen.map(entry => {
  //     Object.keys(entry).forEach(key => entry[key] === undefined && delete entry[key])
  //   })
  // })

  // vaccinationDue.forEach(due => {
  //   if (
  //     !vaccinationsOpen.some(
  //       open => open.vaccinationType === due.vaccinationType
  //     )
  //   ) {
  //     vaccinationsOpen.push(due)
  //   }
  // })
  //vaccinationsOpen = vaccinationDue

  let returnData = data
  returnData.vaccinationsOpen = vaccinationDue
  console.log(returnData)
  return returnData
}
