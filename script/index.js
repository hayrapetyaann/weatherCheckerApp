const cities = ['London', 'New York', 'Paris', 'Tokyo', 'Sydney', 'Rome', 'Cairo', 'Moscow', 'Dubai', 'Rio de Janeiro'];
let guessedCities = 0;
let correctGuesses = 0; 

async function fetchTemperature(city) {
  const apiKey = '9cff733aee57cb05b63dd4f731c46bc4';

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    const data = await response.json();
    const temperature = data.main.temp;
    return temperature;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

function checkGuess(guess, temperature) {
  const deviation = Math.abs(guess - temperature);
  const maxDeviation = 5;

  if (deviation <= maxDeviation) {
    return true; 
  } else {
    return false; 
  }
}

function updateDisplay(city, guess, temperature, isCorrect) {
  const result = document.createElement('div');
  result.className = isCorrect ? 'correct' : 'incorrect';

  result.innerHTML = `
    <p>City: ${city}</p>
    <p>Guess: ${guess}</p>
    <p>Temperature: ${temperature}°C</p>
  `;

  const mainSection = document.getElementById('main_section');

  mainSection.appendChild(result);
}

function handleGuess() {
  const input = document.querySelector('.second_section input');
  const guess = parseInt(input.value);
  input.value = '';

  const cityNameElement = document.querySelector('.second_section p');

  const city = cityNameElement.textContent;

  fetchTemperature(city)
    .then(temperature => {
      const isCorrect = checkGuess(guess, temperature);

      updateDisplay(city, guess, temperature, isCorrect);

      guessedCities++;
      if (isCorrect) {
        correctGuesses++;
      }

      if (guessedCities === 5) {
        let gameResult;
        let emoji;

        if (correctGuesses >= 3) {
          gameResult = 'You won!';
          emoji = '&#127941';
        } else if (correctGuesses < 4) {
          gameResult = 'You lost!';
          emoji = '&#10060';
        } else {
          gameResult = "It's a tie!";
        }

        const result = document.createElement('div');
        result.innerHTML = `<h2>${gameResult} ${emoji}</h2>`;
        const mainSection = document.getElementById('main_section');
        mainSection.appendChild(result);

        input.disabled = true;
        checkButton.disabled = true;
      } else {
        const nextCity = cities[Math.floor(Math.random() * cities.length)];

        setCityName(nextCity);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function setCityName(city) {
  const cityNameElement = document.querySelector('.second_section p');

  cityNameElement.textContent = city;
}

const randomCity = cities[Math.floor(Math.random() * cities.length)];
setCityName(randomCity);

const checkButton = document.querySelector('button');
checkButton.addEventListener('click', handleGuess);
