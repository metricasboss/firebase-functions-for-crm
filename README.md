# Cloud functions para integrações com CRMS

Este repositório viabiliza a implementação de serverless functions usando o firebase para criar webhooks para recebimentos de hooks vindos de CRMS

## Uso

Depois de clonar o repositório, garanta que você tenha instalado o CLI Firebase via `npm`, você pode pegar mais informações sobre a instalação no seu ambiente acessando o [link](https://firebase.google.com/docs/cli?hl=pt-br)

```bash
    npm install -g firebase-tools
```

Não esqueça de garantir que você esta logado no firebase para conseguir utilizar os recursos, você vai ver todos esses comandos [aqui](https://firebase.google.com/docs?hl=pt-br) #RTFM

```bash
firebase login
```

> Faça todo o processo de seleção do projeto especifico para garantir o funcionamento.

Após a instalação na pasta `./functions` instale as dependências do projeto usando os seguintes comandos:

```bash
    npm install
```

Agora na pasta `./functions` realize o deploy para o seu ambiente, a url gerada para cada um dos hooks estará disponível no seu terminal
