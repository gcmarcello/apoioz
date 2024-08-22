export const invite_notification = `<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Convite Aceito - ApoioZ</title>
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
        <h1>Parabéns, seu convite foi aceito!</h1>
      </div>
      <div class="email-content">
        <p>Olá,</p>
        <p>
          Boas notícias! {{supporterName}} entrou na campanha {{campaignName}} no ApoioZ
          usando o seu link de convite. Agradecemos por ajudar a crescer a nossa
          comunidade!
        </p>
        <p style="text-align: center">
          <a href="{{siteLink}}" class="button">Veja seu Progresso</a>
        </p>
        <p>
          Continue aumentando sua rede e aproveite as vantagens de ser um membro ativo da
          comunidade.
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
