document.getElementById('sumForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const numbersInput = document.getElementById('numbers').value;

    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ numbers: numbersInput })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').textContent = `The sum is: ${data.result}`;
    })
    .catch(error => console.error('Error:', error));
});
