const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

const delay = ms => new Promise(res => setTimeout(res, ms));

client.on('qr', (qr) => {
    console.log('Escaneie o QR abaixo para conectar:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot conectado com sucesso!');
});

client.on('auth_failure', msg => {
    console.error('❌ Falha na autenticação:', msg);
});

client.on('disconnected', reason => {
    console.log('⚠️ Cliente desconectado:', reason);
});

client.on('message', async msg => {
    const text = msg.body.toLowerCase();
    if (!msg.from.endsWith('@c.us')) return;

    if (text.match(/(menu|oi|ol[áa]|bom dia|boa tarde|boa noite)/i)) {
        const chat = await msg.getChat();
        const contact = await msg.getContact();
        const name = contact.pushname || 'cliente';

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, `Olá, ${name.split(' ')[0]}! 👋

Seja bem-vindo(a) à Drica Ripilica Sex Store. Pra te ajudar da melhor forma, escolha uma das opções abaixo:

1 - Ver Site
2 - Catálogo Shopee
3 - Kits Dia dos Namorados
4 - Cuidados & Higiene
5 - Sado & Fetiche
6 - Falar com Atendente
7 - Ofertas da Semana
8 - Kits de Cuidados
9 - Brinquedos para Casais`);
    }

    const responses = {
        '1': 'Entre no site: https://dricaripilica.com.br',
        '2': 'Catálogo Shopee: https://shopee.com.br/dricaripilica',
        '3': '🌹 Kits Dia dos Namorados: https://dricaripilica.com.br/categoria-produto/kits-romanticos',
        '4': '🧼 Cuidados íntimos: https://dricaripilica.com.br/categoria-produto/cuidados-e-higiene',
        '5': '⛓️ Fetiches: https://dricaripilica.com.br/categoria-produto/sado-fetiche',
        '6': '💬 Atendimento: https://wa.me/5531983566850',
        '7': '🔥 Promoções: https://dricaripilica.com.br/categoria-produto/ofertas',
        '8': '💋 Kits sensuais: https://dricaripilica.com.br/categoria-produto/kits-sensuais',
        '9': '🧲 Estimuladores: https://dricaripilica.com.br/categoria-produto/estimuladores'
    };

    if (responses[text]) {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, responses[text]);
    }
});

client.initialize();