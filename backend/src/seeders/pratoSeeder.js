
import sequelize from "../config/database.js";
import Prato from "../models/Prato.js";

const pratos = [
    // HAMBÚRGUERES E LANCHES
    {
        nome: "Burger da Amizade",
        descricao: "Pão brioche, blend bovino artesanal, queijo cheddar, cebola caramelizada e molho especial da casa.",
        preco: 38.90,
        disponivel: true
    },
    {
        nome: "Burger Bacon Supreme",
        descricao: "Hambúrguer artesanal, cheddar inglês, bacon crocante, alface e maionese defumada.",
        preco: 42.90,
        disponivel: true
    },
    {
        nome: "Burger Gorgonzola",
        descricao: "Blend bovino, queijo gorgonzola, cebola caramelizada e rúcula no pão brioche.",
        preco: 44.90,
        disponivel: true
    },
    {
        nome: "Burger Chicken Crispy",
        descricao: "Filé de frango empanado, queijo, alface, tomate e molho especial.",
        preco: 34.90,
        disponivel: true
    },
    {
        nome: "Smash Burger Duplo",
        descricao: "Dois discos de carne prensada, queijo cheddar, picles e molho da casa.",
        preco: 36.90,
        disponivel: true
    },

    // PETISCOS E PORÇÕES
    {
        nome: "Batata Frita com Cheddar e Bacon",
        descricao: "Batatas crocantes cobertas com cheddar cremoso e bacon em cubos.",
        preco: 32.90,
        disponivel: true
    },
    {
        nome: "Iscas de Frango Crocantes",
        descricao: "Tiras de frango empanadas e crocantes acompanhadas de molho barbecue.",
        preco: 34.90,
        disponivel: true
    },
    {
        nome: "Onion Rings",
        descricao: "Anéis de cebola empanados e fritos, acompanhados de molho especial.",
        preco: 28.90,
        disponivel: true
    },
    {
        nome: "Dadinho de Tapioca",
        descricao: "Dadinho de tapioca com queijo coalho, servido com geleia de pimenta.",
        preco: 29.90,
        disponivel: true
    },
    {
        nome: "Bolinho de Costela",
        descricao: "Bolinho recheado com costela bovina desfiada e temperos especiais.",
        preco: 36.90,
        disponivel: true
    },
    {
        nome: "Pastel de Camarão",
        descricao: "Pastéis crocantes recheados com camarão temperado e requeijão.",
        preco: 39.90,
        disponivel: true
    },
    {
        nome: "Croquete de Carne",
        descricao: "Croquetes artesanais de carne bovina, acompanhados de mostarda escura.",
        preco: 32.90,
        disponivel: true
    },
    {
        nome: "Calabresa Acebolada",
        descricao: "Linguiça calabresa acebolada, servida com pão fatiado.",
        preco: 34.90,
        disponivel: true
    },
    {
        nome: "Isca de Tilápia",
        descricao: "Filés de tilápia empanados, acompanhados de molho tártaro e limão.",
        preco: 42.90,
        disponivel: true
    },
    {
        nome: "Provolone à Milanesa",
        descricao: "Cubos de queijo provolone empanados e fritos, com geleia de pimenta.",
        preco: 36.90,
        disponivel: true
    },

    // FRUTOS DO MAR
    {
        nome: "Camarão Alho e Óleo",
        descricao: "Camarões salteados no alho e azeite, finalizados com salsinha e limão.",
        preco: 69.90,
        disponivel: true
    },
    {
        nome: "Camarão Empanado",
        descricao: "Camarões empanados e crocantes, servidos com molho rosé artesanal.",
        preco: 64.90,
        disponivel: true
    },
    {
        nome: "Camarão Cremoso",
        descricao: "Camarões salteados em molho cremoso, acompanhados de torradas.",
        preco: 72.90,
        disponivel: true
    },
    {
        nome: "Polvo à Provençal",
        descricao: "Tentáculos de polvo grelhados com alho, azeite, ervas e batatas rústicas.",
        preco: 89.90,
        disponivel: true
    },
    {
        nome: "Lula à Dorê",
        descricao: "Anéis de lula empanados e crocantes, acompanhados de molho tártaro.",
        preco: 58.90,
        disponivel: true
    },
    {
        nome: "Mix de Frutos do Mar",
        descricao: "Camarões, lulas e mexilhões salteados com alho, azeite e ervas.",
        preco: 84.90,
        disponivel: true
    },
    {
        nome: "Casquinha de Siri",
        descricao: "Carne de siri temperada, gratinada e servida na própria casquinha.",
        preco: 32.90,
        disponivel: true
    },
    {
        nome: "Bolinho de Bacalhau",
        descricao: "Bolinho artesanal de bacalhau com batata e temperos portugueses.",
        preco: 39.90,
        disponivel: true
    },

    // PORÇÕES ESPECIAIS
    {
        nome: "Costela Suína ao Barbecue",
        descricao: "Costelinha suína assada lentamente e coberta com molho barbecue.",
        preco: 64.90,
        disponivel: true
    },
    {
        nome: "Picanha na Chapa",
        descricao: "Tiras de picanha grelhadas na chapa, acompanhadas de farofa e vinagrete.",
        preco: 79.90,
        disponivel: true
    },
    {
        nome: "Linguiça Artesanal na Chapa",
        descricao: "Linguiça artesanal grelhada, acompanhada de pão e vinagrete.",
        preco: 42.90,
        disponivel: true
    },
    {
        nome: "Frango à Passarinho",
        descricao: "Pedaços de frango fritos com alho, limão e ervas.",
        preco: 39.90,
        disponivel: true
    },
    {
        nome: "Tábua de Frios",
        descricao: "Seleção de queijos, salame, presunto parma, azeitonas e torradas.",
        preco: 74.90,
        disponivel: true
    },
    {
        nome: "Escondidinho de Carne Seca",
        descricao: "Purê cremoso de mandioca recheado com carne seca desfiada e gratinado.",
        preco: 39.90,
        disponivel: true
    },

    // ACOMPANHAMENTOS
    {
        nome: "Batata Rústica",
        descricao: "Batatas assadas com casca, alecrim, páprica e molho de alho.",
        preco: 26.90,
        disponivel: true
    },
    {
        nome: "Mandioca Frita",
        descricao: "Mandioca cozida e frita, servida com manteiga de ervas.",
        preco: 24.90,
        disponivel: true
    },
    {
        nome: "Polenta Frita",
        descricao: "Polenta crocante por fora e macia por dentro, com parmesão.",
        preco: 25.90,
        disponivel: true
    },
    {
        nome: "Pão de Alho Especial",
        descricao: "Pão artesanal recheado com creme de alho e queijo gratinado.",
        preco: 22.90,
        disponivel: true
    },

    // OPÇÕES LEVES
    {
        nome: "Salada Caesar",
        descricao: "Alface, frango grelhado, croutons, parmesão e molho caesar.",
        preco: 34.90,
        disponivel: true
    },
    {
        nome: "Ceviche de Peixe",
        descricao: "Peixe branco marinado em limão, cebola roxa, coentro e pimenta.",
        preco: 49.90,
        disponivel: true
    },
    {
        nome: "Carpaccio Bovino",
        descricao: "Finas fatias de carne bovina com molho de mostarda, parmesão e alcaparras.",
        preco: 46.90,
        disponivel: true
    },
    {
        nome: "Bruschetta Italiana",
        descricao: "Fatias de pão tostado com tomate, manjericão, azeite e parmesão.",
        preco: 28.90,
        disponivel: true
    },

    // PRATOS INDIVIDUAIS
    {
        nome: "Filé Mignon ao Molho Madeira",
        descricao: "Filé mignon grelhado com molho madeira, acompanhado de batatas e arroz.",
        preco: 72.90,
        disponivel: true
    },
    {
        nome: "Salmão Grelhado",
        descricao: "Filé de salmão grelhado com ervas, acompanhado de legumes e arroz.",
        preco: 76.90,
        disponivel: true
    },
    {
        nome: "Risoto de Camarão",
        descricao: "Arroz arbóreo cremoso com camarões, parmesão e toque de limão siciliano.",
        preco: 68.90,
        disponivel: true
    },
    {
        nome: "Parmegiana de Frango",
        descricao: "Filé de frango empanado, molho de tomate, queijo gratinado e arroz.",
        preco: 42.90,
        disponivel: true
    }
];

async function pratoSeeder() {
    try {
        await sequelize.authenticate();

        await Prato.bulkCreate(pratos);

        console.log("Pratos cadastrados com sucesso!");
    } catch (error) {
        console.error("Erro ao cadastrar pratos:", error);
    } finally {
        await sequelize.close();
    }
}

pratoSeeder();