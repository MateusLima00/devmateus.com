# Imagens do carrossel da tela de login

Esta pasta guarda as imagens exibidas no carrossel da tela de login
(`frontend/login.html`).

## Como adicionar uma nova imagem

1. Coloque o arquivo aqui (formatos aceitos: `.jpg`, `.png`, `.svg`, `.webp`).
   Prefira imagens quadradas ou levemente verticais (proporção entre 1:1 e
   4:5) para melhor encaixe no card do carrossel.
2. Abra `frontend/assets/js/login-carousel-config.js` e adicione um novo
   item no array `LOGIN_CAROUSEL_SLIDES`, por exemplo:

   ```js
   {
     image: 'assets/img/login-carousel/05-nova-imagem.jpg',
     title: 'Título curto do slide',
     caption: 'Descrição de uma linha sobre o slide.'
   }
   ```

3. Salve. Não é necessário alterar `login.html` nem o CSS — o carrossel lê
   a lista automaticamente e já entra no rodízio automático de slides.

## Como remover ou reordenar

- Para remover um slide, apague o objeto correspondente do array em
  `login-carousel-config.js` (o arquivo de imagem pode continuar aqui sem
  problema).
- A ordem de exibição segue a ordem dos itens no array — para reordenar,
  basta reordenar os objetos.

## Slides atuais

| Arquivo                  | Tema                              |
|---------------------------|------------------------------------|
| `01-chamados.jpg`         | Painel de chamados técnicos        |
| `02-equipamentos.jpg`     | Controle de equipamentos de TI     |
| `03-radios.jpg`           | Gestão de rádios e comunicação     |
| `04-seguranca.jpg`        | Monitoramento e segurança (CFTV)   |

São fotos salvas localmente (não carregam de um CDN externo a cada login).
Você pode substituí-las por fotos reais da operação (ex.: fotos do estoque
de TI, da sala de monitoramento, da equipe de suporte) a qualquer momento —
basta seguir os passos acima.
