const validadores = {
    dataNascimento:input => validaDataNascimento(input),
    cpf:input => validaCPF(input),
    cep:input => recuperarCEP(input)

}

const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
]

// criação de um objeto que é um array com todos os tipos de erros sendo validados.

const mensagensDeErro = {
    nome: {
        valueMissing: 'O campo nome não pode estar vazio.'
    },
    email: {
        valueMissing: 'O campo nome não pode estar vazio.',
        typeMismatch: 'O email digitado não é válido'
    },
    senha: {
        valueMissing: 'O campo senha não pode estar vazio.',
        patternMismatch: 'O primeiro caractere da senha deve ser uma letra, deve conter no mínimo 4 caracteres e no máximo 15 caracteres e não podem ser usados ​​caracteres além de letras, números e o sublinhado'
    },
    dataNascimento: {
        valueMissing: 'O campo data de nascimento não pode estar vazio.',
        customError: 'Você deve ter no mínimo 18 anos para se cadastrar.'
    },
    cpf: {
        valueMissing: 'O campo cpf não pode estar vazio.',
        customError: 'O CPF informado é inválido.'
    },
    cep: {
        valueMissing: 'O campo cep não pode estar vazio.',
        patternMismatch: 'O CEP digitado não é válido.',
        customError: 'Não foi possível buscar o CEP.'       
    },
    logradouro: {
        valueMissing: 'O campo logradouro não pode estar vazio.',
    },
    cidade: {
        valueMissing: 'O campo cidade não pode estar vazio.'
    },
    estado: {
        valueMissing: 'O campo estado não pode estar vazio.'
    }, 
    preco: {
        valueMissing: 'O campo preço não pode estar vazio.'
    }
    
}

export function valida(input) {
    const tipoDeInput = input.dataset.tipo
    
    if(validadores[tipoDeInput]) {
        validadores[tipoDeInput](input);
    }

    //o tipo de input está contido dentro da variável validadores. Se estiver, chama a função relacionada aquele input.
    //verifica qual tipo de input. Dataset acessa os data attributes de um elemento.


    if(input.validity.valid) {
        input.parentElement.classList.remove('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = ''
    } else {
        input.parentElement.classList.add('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemErro(tipoDeInput, input)
    }
}

// a condicional recebe o atributo validity do input, e caso o valor valid seja verdadeiro, a classe é removida da lista de classes do elemento pai do input.
// caso o valor valid seja falso, a classe é adicionada ao elemento pai.
// a condicional também recebe a classe do span da mensagem de erro, caso o input esteja válido, retorna uma string vazia. Caso inválido, uma mensagem de erro.

function mostraMensagemErro (tipoDeInput, input) {
    let mensagem = '';

    tiposDeErro.forEach(erro => {
        if(input.validity[erro]) {
            mensagem = mensagensDeErro[tipoDeInput][erro]
        }
    })

    return mensagem
}   
// laço de repetição percorre o array tiposDeErro e verifica se o atributo validity do input possui um erro presente na lista.
// caso o input validity retorne verdadeiro, a mensagem de erro será gerada com base no tipo de input e no tipo de erro.


function validaDataNascimento(input) {
    const dataRecebida = new Date(input.value); // transforma valor da data recebida de string para data.
    let mensagem = '';
    
    if(!maiorQue18(dataRecebida)) {
        mensagem = 'Você deve ter no mínimo 18 anos para se cadastrar.'
    }

    input.setCustomValidity(mensagem); 
}

//validação do valor informado pelo usuário.
// como o retorno da função maiorQue18 é true ou false, a condicional exige que seja false (!) para retornar a mensagem.

    function maiorQue18(data) {
    const dataAtual = new Date(); //nem Date sem passar uma data, o js atribui automaticamente a data atual.
    const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate());
    return dataMais18 <= dataAtual; // retorno é true ou false

}

//data.getUTCFullYear + 18 permite receber o ano desejado e somar 18. No caso, a data é a informada pelo usuário.
// a ideia é somar o ano de nascimento do usuário com 18 e comparar se o resultado é maior ou igual ao ano atual.
// caso seja maior, o usuário não possui 18 anos.

function validaCPF(input) {
    const cpfFormatado = input.value.replace(/\D/g, '');
    let mensagem = '';

    if(!confereCPF(cpfFormatado)) {
        mensagem = 'O CPF informado é inválido.'
    }

    input.setCustomValidity(mensagem)
}

// função validCPF recebe o input e troca tudo o que não for número para string vazia (uso de regex)

function confereCPF(cpf) {
    const valoresInvalidos = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ]

    let cpfValido = true;

    valoresInvalidos.forEach(valor => {
        if(valor == cpf) {
            cpfValido = false
        }
    })

    return cpfValido;

}

function recuperarCEP(input) {
    const cep = input.value.replace(/\D/g, ''); //substituir tudo que não for número por nada

    const url = `https://viacep.com.br/ws/${cep}/json/`; // url da via cep
    const options = {
        method: 'GET', // método de requisição feito
        mode: 'cors', // modo da requisição, comunicação entre as API's
        headers: { // o que se espera da resposta da api
            'content-type': 'application/json;charset=utf-8' //resposta vai estar no padrão utf-8 
        }
    }

    // criar condição para que o input esteja válido antes de fazer a requisição
    // condicional - caso o valor do input não esteja fora do padrão e nem vazio, é realizada a requisição
    // requisição através do fetch, que recebe a url e a variável options como parâmetros.
    // data - dados recebidos pela API
    
    if(!input.validity.patternMismatch && !input.validity.valueMissing) {
        fetch(url, options).then(
            response => response.json()
        ).then(
            data => {
                if(data.erro) {
                    input.setCustomValidity('Não foi possível buscar o CEP')
                    return
                }
                input.setCustomValidity ('');
                preencheCamposCEP(data); // preenche campos com os dados 
                return
            }
        )
    }
}

function preencheCamposCEP(data) { 
    const logradouro = document.querySelector('[data-tipo = "logradouro"]');
    const cidade = document.querySelector('[data-tipo = "cidade"]');
    const estado = document.querySelector('[data-tipo = "estado"]');

    logradouro.value = data.logradouro;
    cidade.value = data.localidade;
    estado.value = data.uf;
}

// função recebe os dados da API, seleciona os valores de input que serão alterados e atribui valor dos dados da API para os elementos.