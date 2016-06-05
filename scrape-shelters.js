const cheerio = require('cheerio')
const fetch = require('node-fetch')

module.exports = function scrapeShelters() {

  // Search Form
  // https://211colorado.communityos.org/cms/node/142
  const url = 'https://211colorado.communityos.org/z_eda/publicshelterassist.taf?function=list&_UserReference=AC1E0201471A4A081A64B7E72B774E3ADF7F'

  const columns = [
    'Shelter Name',
    'Agency Name',
    'Shelter Hotline',
    'Shelter Main Phone',
    'Current Population',
    'Single Spaces Available',
    'Family Spaces Available',
    'Current Total Capacity',
    'Current Need',
    'Last Updated',
    'Location',
    'City',
    'Shelter ID',
    'Status'
  ]

  return fetch(url)
    .then(response => response.text())
    .then(html => {
      const shelterData = []
      $ = cheerio.load(html)
      $('table').eq(3).find('tr').each((i, element) => {
        if(i === 0) {
          return
        }
        const shelter = {};
        const cells = $(element).find('td')
        if(cells.length) {
          cells.each((i, element) => {
            const value = $(element).text().trim()
            shelter[columns[i]] = value
          })
          if(shelter['Single Spaces Available'] > 0) {
            shelterData.push(shelter)
          }
        }
      })

      return Promise.resolve(shelterData)
    })
}
