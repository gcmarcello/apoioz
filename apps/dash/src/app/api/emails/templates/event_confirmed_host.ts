export const event_confirmed_host = `<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Evento Confirmado - ApoioZ</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .email-container {
        max-width: 600px;
        margin: 40px auto;
        background: #fff;
        border: 1px solid #ddd;
        overflow: hidden;
      }
      .email-header {
        background-color: rgb(225, 29, 72);
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .email-content {
        padding: 20px;
        line-height: 1.6;
        color: #333;
      }
      .email-footer {
        text-align: center;
        padding: 20px;
        background-color: #efefef;
        color: #333;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        margin: 20px 0;
        background-color: rgb(225, 29, 72);
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h1>Evento Confirmado: {{eventName}}</h1>
      </div>
      <div class="email-content">
        <p>Olá,</p>
        <p>Temos o prazer de anunciar que o evento "{{eventName}}" foi confirmado!</p>
        <p>Aqui estão os detalhes do evento:</p>
        <ul>
          <li>Data: {{eventDate}}</li>
          <li>Local: {{eventLocation}}</li>
        </ul>
        <p style="text-align: center">
          <a href="https://apoioz.com.br/painel/calendario" class="button"
            >Mais Informações</a
          >
        </p>
        <p>
          Prepare-se para uma experiência incrível e não hesite em entrar em contato
          conosco para mais informações.
        </p>
        <p>Atenciosamente,<br />Equipe ApoioZ</p>
      </div>
      <div class="email-footer">
        <p>&copy; 2024 ApoioZ. Todos os direitos reservados.</p>
      </div>
    </div>
  </body>
</html>
`;
