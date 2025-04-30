# Pet Virtual - Jogo Mobile

Um jogo de pet virtual desenvolvido em HTML/CSS/JavaScript puro, preparado para publicação na Play Store.

## Características

- Sistema de pet virtual com status de energia e humor
- Missões diárias com recompensas
- Sistema de upgrades (produção, temporários e visuais)
- Sons e efeitos visuais
- Salvamento automático do progresso
- Interface responsiva para dispositivos móveis

## Arquivos de Som Necessários

Coloque os seguintes arquivos de som na pasta `sounds/`:
- `brincar.mp3`
- `dormir.wav`
- `resgatar.wav`
- `missao_completa.wav`

## Preparação para Android

1. Instale o Cordova ou Capacitor:
```bash
npm install -g cordova
# ou
npm install -g @capacitor/cli
```

2. Crie um novo projeto:
```bash
cordova create pet-virtual
# ou
npx cap init pet-virtual
```

3. Adicione a plataforma Android:
```bash
cordova platform add android
# ou
npx cap add android
```

4. Copie os arquivos do jogo para a pasta `www/` do projeto Cordova/Capacitor.

5. Construa e execute:
```bash
cordova build android
# ou
npx cap build android
```

## Estrutura do Projeto

```
pet-virtual/
├── index.html          # Estrutura principal do jogo
├── style.css          # Estilos e layout responsivo
├── game.js            # Lógica principal do jogo
├── pet.js             # Sistema do pet
├── missions.js        # Sistema de missões
├── audio.js           # Gerenciamento de áudio
└── sounds/            # Arquivos de som
    ├── brincar.mp3
    ├── dormir.wav
    ├── resgatar.wav
    └── missao_completa.wav
```

## Como Jogar

1. Digite o nome do seu pet na tela inicial
2. Clique em "Iniciar" para começar
3. Use os botões de ação para interagir com seu pet:
   - 🍖 Alimentar: Aumenta energia e humor
   - 🎮 Brincar: Aumenta humor, mas gasta energia
   - 😴 Dormir: Recupera energia e humor
4. Complete missões diárias para ganhar bits
5. Use bits para comprar upgrades:
   - Produção: Aumenta BPS (bits por segundo)
   - Temporários: Bônus por tempo limitado
   - Visuais: Personaliza a aparência do pet

## Salvamento

O jogo salva automaticamente:
- Progresso do pet
- Bits e BPS
- Missões
- Upgrades
- Configurações de som

## Desenvolvimento

Para modificar o jogo:
1. Edite os arquivos HTML/CSS/JS conforme necessário
2. Teste em um navegador
3. Reconstrua o projeto Android
4. Teste no dispositivo ou emulador

## Licença

Este projeto está sob a licença MIT. 