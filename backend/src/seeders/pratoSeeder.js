
import sequelize from "../config/database.js";
import Prato from "../models/prato.js";

const pratos = [
    // HAMBÚRGUERES
    {
        nome: "Burger da Amizade",
        descricao: "Pão brioche, blend bovino artesanal, cheddar, cebola caramelizada e molho especial.",
        preco: 38.90,
        categoria: "Hambúrgueres",
        disponivel: true
    },
    {
        nome: "Burger Bacon Supreme",
        descricao: "Hambúrguer artesanal, cheddar, bacon crocante, alface e maionese defumada.",
        preco: 42.90,
        categoria: "Hambúrgueres",
        disponivel: true
    },
    {
        nome: "Burger Gorgonzola",
        descricao: "Blend bovino, queijo gorgonzola, cebola caramelizada e rúcula no pão brioche.",
        preco: 44.90,
        categoria: "Hambúrgueres",
        disponivel: true
    },
    {
        nome: "Burger Chicken Crispy",
        descricao: "Filé de frango empanado, queijo, alface, tomate e molho especial.",
        preco: 34.90,
        categoria: "Hambúrgueres",
        disponivel: true
    },
    {
        nome: "Smash Burger Duplo",
        descricao: "Dois discos de carne prensada, cheddar, picles e molho da casa.",
        preco: 36.90,
        categoria: "Hambúrgueres",
        disponivel: true
    },

    // PETISCOS
    {
        nome: "Batata Frita com Cheddar e Bacon",
        descricao: "Batatas crocantes cobertas com cheddar cremoso e bacon em cubos.",
        preco: 32.90,
        categoria: "Petiscos",
        disponivel: true
    },
    {
        nome: "Iscas de Frango Crocantes",
        descricao: "Tiras de frango empanadas acompanhadas de molho barbecue.",
        preco: 34.90,
        categoria: "Petiscos",
        disponivel: true
    },
    {
        nome: "Onion Rings",
        descricao: "Anéis de cebola empanados e fritos com molho especial.",
        preco: 28.90,
        categoria: "Petiscos",
        disponivel: true
    },
    {
        nome: "Dadinho de Tapioca",
        descricao: "Dadinho de tapioca com queijo coalho e geleia de pimenta.",
        preco: 29.90,
        categoria: "Petiscos",
        disponivel: true
    },
    {
        nome: "Bolinho de Costela",
        descricao: "Bolinho recheado com costela bovina desfiada e temperos especiais.",
        preco: 36.90,
        categoria: "Petiscos",
        disponivel: true
    },
    {
        nome: "Croquete de Carne",
        descricao: "Croquetes artesanais de carne bovina com mostarda escura.",
        preco: 32.90,
        categoria: "Petiscos",
        disponivel: true
    },
    {
        nome: "Provolone à Milanesa",
        descricao: "Cubos de queijo provolone empanados com geleia de pimenta.",
        preco: 36.90,
        categoria: "Petiscos",
        disponivel: true
    },
    {
        nome: "Calabresa Acebolada",
        descricao: "Linguiça calabresa acebolada, servida com pão fatiado.",
        preco: 34.90,
        categoria: "Petiscos",
        disponivel: true
    },

    // FRUTOS DO MAR
    {
        nome: "Camarão Alho e Óleo",
        descricao: "Camarões salteados no alho e azeite, finalizados com salsinha e limão.",
        preco: 69.90,
        categoria: "Frutos do Mar",
        disponivel: true
    },
    {
        nome: "Camarão Empanado",
        descricao: "Camarões empanados e crocantes com molho rosé artesanal.",
        preco: 64.90,
        categoria: "Frutos do Mar",
        disponivel: true
    },
    {
        nome: "Camarão Cremoso",
        descricao: "Camarões salteados em molho cremoso, acompanhados de torradas.",
        preco: 72.90,
        categoria: "Frutos do Mar",
        disponivel: true
    },
    {
        nome: "Polvo à Provençal",
        descricao: "Tentáculos de polvo grelhados com alho, azeite, ervas e batatas rústicas.",
        preco: 89.90,
        categoria: "Frutos do Mar",
        disponivel: true
    },
    {
        nome: "Lula à Dorê",
        descricao: "Anéis de lula empanados e crocantes com molho tártaro.",
        preco: 58.90,
        categoria: "Frutos do Mar",
        disponivel: true
    },
    {
        nome: "Mix de Frutos do Mar",
        descricao: "Camarões, lulas e mexilhões salteados com alho, azeite e ervas.",
        preco: 84.90,
        categoria: "Frutos do Mar",
        disponivel: true
    },
    {
        nome: "Casquinha de Siri",
        descricao: "Carne de siri temperada, gratinada e servida na própria casquinha.",
        preco: 32.90,
        categoria: "Frutos do Mar",
        disponivel: true
    },
    {
        nome: "Bolinho de Bacalhau",
        descricao: "Bolinho artesanal de bacalhau com batata e temperos portugueses.",
        preco: 39.90,
        categoria: "Frutos do Mar",
        disponivel: true
    },
    {
        nome: "Isca de Tilápia",
        descricao: "Filés de tilápia empanados com molho tártaro e limão.",
        preco: 42.90,
        categoria: "Frutos do Mar",
        disponivel: true
    },
    {
        nome: "Pastel de Camarão",
        descricao: "Pastéis crocantes recheados com camarão temperado e requeijão.",
        preco: 39.90,
        categoria: "Frutos do Mar",
        disponivel: true
    },

    // PORÇÕES
    {
        nome: "Costela Suína ao Barbecue",
        descricao: "Costelinha suína assada lentamente e coberta com molho barbecue.",
        preco: 64.90,
        categoria: "Porções",
        disponivel: true
    },
    {
        nome: "Picanha na Chapa",
        descricao: "Tiras de picanha grelhadas, acompanhadas de farofa e vinagrete.",
        preco: 79.90,
        categoria: "Porções",
        disponivel: true
    },
    {
        nome: "Linguiça Artesanal na Chapa",
        descricao: "Linguiça artesanal grelhada, acompanhada de pão e vinagrete.",
        preco: 42.90,
        categoria: "Porções",
        disponivel: true
    },
    {
        nome: "Frango à Passarinho",
        descricao: "Pedaços de frango fritos com alho, limão e ervas.",
        preco: 39.90,
        categoria: "Porções",
        disponivel: true
    },
    {
        nome: "Tábua de Frios",
        descricao: "Seleção de queijos, salame, presunto parma, azeitonas e torradas.",
        preco: 74.90,
        categoria: "Porções",
        disponivel: true
    },

    // ACOMPANHAMENTOS
    {
        nome: "Batata Rústica",
        descricao: "Batatas assadas com casca, alecrim, páprica e molho de alho.",
        preco: 26.90,
        categoria: "Acompanhamentos",
        disponivel: true
    },
    {
        nome: "Mandioca Frita",
        descricao: "Mandioca cozida e frita, servida com manteiga de ervas.",
        preco: 24.90,
        categoria: "Acompanhamentos",
        disponivel: true
    },
    {
        nome: "Polenta Frita",
        descricao: "Polenta crocante por fora e macia por dentro, com parmesão.",
        preco: 25.90,
        categoria: "Acompanhamentos",
        disponivel: true
    },
    {
        nome: "Pão de Alho Especial",
        descricao: "Pão artesanal recheado com creme de alho e queijo gratinado.",
        preco: 22.90,
        categoria: "Acompanhamentos",
        disponivel: true
    },

    // MASSAS
    {
        nome: "Penne ao Molho Quatro Queijos",
        descricao: "Massa penne envolvida em molho cremoso de quatro queijos.",
        preco: 42.90,
        categoria: "Massas",
        disponivel: true
    },
    {
        nome: "Fettuccine ao Molho Alfredo",
        descricao: "Massa fettuccine com molho branco, parmesão e toque de noz-moscada.",
        preco: 39.90,
        categoria: "Massas",
        disponivel: true
    },
    {
        nome: "Espaguete à Bolonhesa",
        descricao: "Espaguete com molho de tomate artesanal e carne moída.",
        preco: 39.90,
        categoria: "Massas",
        disponivel: true
    },
    {
        nome: "Penne ao Pesto",
        descricao: "Massa penne com pesto de manjericão, parmesão e azeite.",
        preco: 42.90,
        categoria: "Massas",
        disponivel: true
    },
    {
        nome: "Talharim com Camarão",
        descricao: "Massa fresca com camarões salteados e molho cremoso.",
        preco: 59.90,
        categoria: "Massas",
        disponivel: true
    },

    // PIZZAS
    {
        nome: "Pizza Margherita",
        descricao: "Molho de tomate, muçarela, tomate fresco, manjericão e azeite.",
        preco: 46.90,
        categoria: "Pizzas",
        disponivel: true
    },
    {
        nome: "Pizza Calabresa",
        descricao: "Molho de tomate, muçarela, calabresa fatiada e cebola.",
        preco: 48.90,
        categoria: "Pizzas",
        disponivel: true
    },
    {
        nome: "Pizza Quatro Queijos",
        descricao: "Muçarela, provolone, parmesão e gorgonzola.",
        preco: 54.90,
        categoria: "Pizzas",
        disponivel: true
    },
    {
        nome: "Pizza Bacon",
        descricao: "Molho de tomate, muçarela, bacon crocante e orégano.",
        preco: 52.90,
        categoria: "Pizzas",
        disponivel: true
    },
    {
        nome: "Pizza Frango com Catupiry",
        descricao: "Frango desfiado, muçarela e catupiry cremoso.",
        preco: 52.90,
        categoria: "Pizzas",
        disponivel: true
    },
    {
        nome: "Pizza Portuguesa",
        descricao: "Presunto, ovos, cebola, ervilha, muçarela e azeitonas.",
        preco: 54.90,
        categoria: "Pizzas",
        disponivel: true
    },

    // SOBREMESAS
    {
        nome: "Brownie com Sorvete",
        descricao: "Brownie de chocolate servido com sorvete de creme.",
        preco: 19.90,
        categoria: "Sobremesas",
        disponivel: true
    },
    {
        nome: "Petit Gateau",
        descricao: "Bolinho de chocolate com interior cremoso e sorvete de creme.",
        preco: 24.90,
        categoria: "Sobremesas",
        disponivel: true
    },
    {
        nome: "Pudim de Leite",
        descricao: "Pudim tradicional de leite condensado com calda de caramelo.",
        preco: 14.90,
        categoria: "Sobremesas",
        disponivel: true
    },
    {
        nome: "Cheesecake de Frutas Vermelhas",
        descricao: "Cheesecake cremoso com cobertura de frutas vermelhas.",
        preco: 22.90,
        categoria: "Sobremesas",
        disponivel: true
    },
    {
        nome: "Churros com Doce de Leite",
        descricao: "Mini churros crocantes com açúcar, canela e doce de leite.",
        preco: 18.90,
        categoria: "Sobremesas",
        disponivel: true
    },
    {
        nome: "Mousse de Chocolate",
        descricao: "Mousse artesanal de chocolate meio amargo.",
        preco: 16.90,
        categoria: "Sobremesas",
        disponivel: true
    },

    // BEBIDAS - REFRIGERANTES
    {
        nome: "Coca-Cola Lata",
        descricao: "Refrigerante Coca-Cola 350ml.",
        preco: 7.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Coca-Cola Zero Lata",
        descricao: "Refrigerante Coca-Cola Zero 350ml.",
        preco: 7.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Guaraná Antarctica Lata",
        descricao: "Refrigerante Guaraná Antarctica 350ml.",
        preco: 7.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Fanta Laranja Lata",
        descricao: "Refrigerante Fanta Laranja 350ml.",
        preco: 7.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Sprite Lata",
        descricao: "Refrigerante Sprite 350ml.",
        preco: 7.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Água Mineral sem Gás",
        descricao: "Garrafa de água mineral sem gás 500ml.",
        preco: 5.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Água Mineral com Gás",
        descricao: "Garrafa de água mineral com gás 500ml.",
        preco: 6.00,
        categoria: "Bebidas",
        disponivel: true
    },

    // BEBIDAS - SUCOS
    {
        nome: "Suco Natural de Laranja",
        descricao: "Suco de laranja natural feito na hora 400ml.",
        preco: 12.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Suco Natural de Limão",
        descricao: "Suco de limão natural 400ml.",
        preco: 10.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Suco de Maracujá",
        descricao: "Suco natural de maracujá 400ml.",
        preco: 12.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Suco de Abacaxi com Hortelã",
        descricao: "Suco natural de abacaxi com hortelã 400ml.",
        preco: 13.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Limonada Suíça",
        descricao: "Limão batido com água e leite condensado 400ml.",
        preco: 14.00,
        categoria: "Bebidas",
        disponivel: true
    },

    // BEBIDAS - CERVEJAS
    {
        nome: "Heineken Long Neck",
        descricao: "Cerveja Heineken 330ml.",
        preco: 14.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Heineken Zero",
        descricao: "Cerveja Heineken sem álcool 330ml.",
        preco: 12.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Budweiser Long Neck",
        descricao: "Cerveja Budweiser 330ml.",
        preco: 12.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Corona Extra",
        descricao: "Cerveja Corona Extra 330ml com toque de limão.",
        preco: 14.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Stella Artois",
        descricao: "Cerveja Stella Artois 330ml.",
        preco: 13.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Original 600ml",
        descricao: "Cerveja Original em garrafa de 600ml.",
        preco: 16.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Brahma Chopp 600ml",
        descricao: "Cerveja Brahma Chopp em garrafa de 600ml.",
        preco: 14.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Eisenbahn Pilsen",
        descricao: "Cerveja Eisenbahn Pilsen 355ml.",
        preco: 12.00,
        categoria: "Bebidas",
        disponivel: true
    },

    // BEBIDAS - DRINKS
    {
        nome: "Caipirinha de Limão",
        descricao: "Cachaça, limão, açúcar e gelo.",
        preco: 22.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Caipiroska de Morango",
        descricao: "Vodka, morango fresco, açúcar e gelo.",
        preco: 26.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Caipirinha de Maracujá",
        descricao: "Cachaça, polpa de maracujá, açúcar e gelo.",
        preco: 24.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Mojito",
        descricao: "Rum, limão, hortelã, açúcar, água com gás e gelo.",
        preco: 27.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Moscow Mule",
        descricao: "Vodka, limão, xarope de gengibre e espuma de gengibre.",
        preco: 29.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Gin Tônica",
        descricao: "Gin, água tônica, limão e especiarias.",
        preco: 29.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Aperol Spritz",
        descricao: "Aperol, espumante, água com gás e laranja.",
        preco: 32.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Piña Colada",
        descricao: "Rum, leite de coco, suco de abacaxi e gelo.",
        preco: 28.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Negroni",
        descricao: "Gin, vermute tinto e bitter.",
        preco: 32.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Whisky Sour",
        descricao: "Whisky, limão, açúcar e clara pasteurizada.",
        preco: 32.00,
        categoria: "Bebidas",
        disponivel: true
    },

    // BEBIDAS - OUTRAS OPÇÕES
    {
        nome: "Chá Gelado de Pêssego",
        descricao: "Chá preto gelado com sabor de pêssego 400ml.",
        preco: 10.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Energético",
        descricao: "Bebida energética em lata 250ml.",
        preco: 13.00,
        categoria: "Bebidas",
        disponivel: true
    },
    {
        nome: "Água Tônica",
        descricao: "Água tônica em lata 350ml.",
        preco: 7.00,
        categoria: "Bebidas",
        disponivel: true
    }
];

async function pratoSeeder() {
    try {
        await sequelize.authenticate();

        await Prato.bulkCreate(pratos);

        console.log(`${pratos.length} produtos cadastrados com sucesso!`);
    } catch (error) {
        console.error("Erro ao cadastrar produtos:", error);
    } finally {
        await sequelize.close();
    }
}

pratoSeeder();