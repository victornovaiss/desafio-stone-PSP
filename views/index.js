function catchData() {

    var value = document.querySelector('#value').value
    var payment_type = document.querySelector('#payment_type').value
    var card_number = document.querySelector('#card_number').value
    var card_owner = document.querySelector('#card_owner').value
    var validaty = document.querySelector('#validaty').value
    var CVV = document.querySelector('#CVV').value
    var description = document.querySelector('#description').value

    var data = {
        value: value,
        payment_type: payment_type,
        card_number: Number(card_number),
        card_owner: card_owner,
        validaty: validaty,
        CVV: CVV,
        description: description
    }

    var dataStatus = 0

    for (const key in data) {
        if (data[key] == false) {
            dataStatus += 1
        }
    }

    if (dataStatus != 0) {
        window.alert(`Existem ${dataStatus} campos vazios, por favor preencha todos!`)
    } else if (isNaN(data.card_number) || (data.card_number.toString()).length < 16) {
        window.alert('Formato inválido do número do cartão')
    }
    else {
        postData(data)
    }

}

function postData(data) {

    const url = 'http://localhost:3000/transactions/post'
    const init = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        mode: 'cors'
    }

    fetch(url, init)

}

function showTransactions() {

    async function getData() {

        const url = 'http://localhost:3000/transactions'
        
        var data = await fetch(url)
            .then(res => res.json())
            .then(el => {
                showContent(el)
                console.log(el)
            })
        console.log(data)
    }

    getData()

    function showContent(content) {
        let output = ''

        for (let ind of content) {
            output += `<div class='transaction'>
                <li>Dono do Cartão: ${ind.card_owner}</li>
                <li>Descrição: ${ind.description}</li>
                <li>Valor: R$${ind.value}</li>
                <li>Num do Cartão: ****.****.${ind.card_number.slice(5,9)}.****</li>
                <li> ${ind.validaty.slice(0,2)}/${ind.validaty.slice(2,4)}</li>
                <li>CVV: ***</li>
                <li>Tipo de Pagamento: ${ind.payment_type.replace('_',' ')}</li>
            </div>`
        }
        document.querySelector('#main').innerHTML = output
    }
}

if(window.location.href == 'http://localhost:porta-da-pag-html/views/page-2.html'){
    showTransactions()
}
