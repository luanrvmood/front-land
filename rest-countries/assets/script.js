(function() {
  renderApiCountries()
  registerEventListeners()
})()

function renderApiCountries() {
  const API_ENDPOINT = 'https://restcountries.eu/rest/v2/all'
  const countriesWrapper = document.querySelector('[data-countries]')

  fetch(API_ENDPOINT)
    .then(res => res.json())
    .then(res => {
      countriesWrapper.innerHTML = ''
      return res
    })
    .then(res => res.map(country => {
      const countryEl = document.createElement('div')
      countryEl.classList.add('country')

      countryEl.innerHTML = `
        <img src=${country['flag']}>
        <p>${country['name']}</p>
        <ul>
          <li><strong>Population:</strong> ${country['population']}</li>
          <li><strong>Region:</strong> ${country['region']}</li>
          <li><strong>Capital:</strong> ${country['capital']}</li>
        </ul>
      `

      countriesWrapper.appendChild(countryEl)
    }))
    .catch(err => countriesWrapper.innerHTML = `${err}`)
}

function registerEventListeners() {
  const themeToggle = document.querySelector('[data-theme-toggle]')
  const searchInput = document.querySelector('[data-search]')
  const dropdownToggle = document.querySelector('[data-open-dropdown]')
  const regionsList = document.querySelector('[data-regions]')

  // toggle dark/light mode
  themeToggle.addEventListener('click', () => {
    document.querySelector('body').classList.toggle('dark')
  })

  // search for a country
  searchInput.addEventListener('input', event => {
    const {value: researchedName} = event.target
    const countries = document.querySelectorAll(
      '.country:not([style*="display: none"])'
    )

    const filteredCountries = document.querySelectorAll(
      '.country[style*="display: none"]'
    )

    countries.forEach(country => {
      const countryName = country.children[1].textContent.toLowerCase()

      if (researchedName === '') return filteredCountries.forEach(
        country => country.style.display = 'block'
      )

      country.style.display = countryName.includes(researchedName)
        ? 'block' : 'none'
    })
  })

  // open/close filter by region dropdown
  dropdownToggle.addEventListener('click', () => {
    regionsList.classList.toggle('active')
  })

  // filter by region
  regionsList.addEventListener('click', event => {
    const {textContent: selectedRegion} = event.target
    const countries = document.querySelectorAll('.country')

    regionsList.classList.toggle('active')
    document.querySelector('[data-dropdown-label]').textContent = selectedRegion

    countries.forEach(country => {
      const regionName = country.children[2].children[1].lastChild.textContent

      if (selectedRegion === 'All') return country.style.display = 'block'

      country.style.display = regionName.includes(selectedRegion)
        ? 'block' : 'none'
    })
  })
}
