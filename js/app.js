import {valida} from './validacao.js'

// 
const inputs = document.querySelectorAll('input');

inputs.forEach(input => {

    if(input.dataset.tipo === 'preco') {
        SimpleMaskMoney.setMask(input, {
                prefix: 'R$ ',
                fixed: true,
                fractionDigits: 2,
                decimalSeparator: ',',
                thousandsSeparator: '.',
                cursor: 'end'
        } )
    }
    input.addEventListener('blur', (evento) => {
        valida(evento.target)
    })
}) 
// dessa forma, a função valida está sendo chamada para cada input do formulário.
// SimpleMaskMoney - condicional recebe qual o tipo do input, caso seja do tipo preço, é aplicada a máscara monetária no input.
// setMask recebe 2 parâmetros, o input e o objeto contendo os argumentos.