const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Host': 'numbersapi.p.rapidapi.com',
		'X-RapidAPI-Key': '08276da6a9msh80c0fbcf951ed5cp1daf7ejsn3d8e2fa0de26'
	}
};

fetch('https://numbersapi.p.rapidapi.com/random/trivia?min=5&max=100&fragment=true&json=true', options)
    .then(response => response.json())
    .then(Data => {
        const text = Data.text;
        const number = Data.number;
        const Text = document.getElementById('Text');
        const Num = document.getElementById('Number');

        Text.innerHTML = text;
        Num.innerHTML = number;
    })
    // .then(response => console.log(response))
    // .catch(err => console.error(err));