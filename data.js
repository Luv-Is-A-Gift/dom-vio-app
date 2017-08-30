// temp data for login + form first go
// data structure for db (?).
// will incorporate sequelize data types later, strings for now

module.exports = {
 adminData: [
    {
      adminUsername: "TScott",
      adminPassword:"luvwins2017"
    }
 ],
 userData: [
    {
      id: 1,
      logID: 1,
      firstname: "John",
      lastname: "Doe",
      username: "JDoe",
      email: "JDoe@gmail.com",
      password: "98Grey",
      dateOfBirth: "08/08/1998",
      // DOB: "08/08/1998",
      userPrimaryPhone: "541-754-3010",  //add type? (mobile = majority, still a web app avail thru any device...)
      userAddlPhone: "",
      homeAddress: "70 Apt B Bowman St. South Windsor, CT 06074",
      homeAddressInfo: "We live in the apartment on the right side of the duplex.",
      addlNames :
        [
            {
              firstname: "Jill",
              lastname: "Doe",
              relationshipToUser: "Guardian/Threat",
              // DOB: "09/09/1969"
              dateOfBirth: "09/09/1969"
            },
            {
              firstname: "Jim",
              lastname: "Doe",
              relationshipToUser: "Guardian/Threat",
              // DOB: "07/07/1967"
              dateOfBirth: "07/07/1967"
            }
        ],
      addlAddresses:
        [
            {
              type: "Place of Work",
              address: "Starbucks Some New Town Center 856 Cromwell Avenue Unit A Rocky Hill, CT 06067",
            }
        ],
    },
    {
      id: 2,
      logRecordID: 2,
      firstname: "Vita",
      lastname: "Polley",
      username: "Vee",
      email: "Vee@gmail.com",
      password: "456pickupstix",
      dateOfBirth: "03/30/1988",
      // DOB: "03/30/1988",
      userPrimaryPhone: "555-555-5555",
      userAddlPhone: "444-444-4444",
      homeAddress: "258 Test Blvd. Durham, NC 27701",
      homeAddressInfo: "I rent this house. My partner has his own apartment, but he is here most often. There is one other tenant who rents the mother in-law apartment behind the house. I would prefer not to get her involved.",
      addlNames :
        [
            {
              firstname: "Boy",
              lastname: "Polley",
              relationshipToUser: "Son",
              // DOB: "11/02/2014",
              dateOfBirth: "11/02/2014"
            },
            {
              firstname: "Dick",
              lastname: "Smith",
              relationshipToUser: "Partner/Threat",
              // DOB: "01/01/1985",
              dateOfBirth: "01/01/1985"
            }
        ],
      addlAddresses:
        [
            {
              type: "Place of Work",
              address: "555 Main Avenue Unit C Durham, NC 27710",
            },
            {
              type: "Partner's Address",
              address: "35 Red Flag Rd. Apt F Durham, NC 27701",
            }
        ],
    },
  ],

logData: [
    {
      id: 1,
      userID: 1,
      user: "John Doe",
      logs: [
        {
          timestamp: "12/09/16",
          details: "test, sample, example",
        },
        {
          timestamp: "01/01/17",
          details: "test, sample, example",
        },
        {
          timestamp: "01/10/17",
          details: "test, sample, example",
        },
        {
          timestamp: "04/06/17",
          details: "test, sample, example",
        }
      ]
    },
    {
      id: 2,
      userID: 2,
      user: "Vita Polley",
      logs: [
        {
          timestamp: "12/09/16",
          details: "test, sample, example",
        },
        {
          timestamp: "01/01/17",
          details: "test, sample, example",
        },
        {
          timestamp: "01/10/17",
          details: "test, sample, example",
        },
        {
          timestamp: "04/06/17",
          details: "test, sample, example",
        }
      ]
    }
  ]
}
