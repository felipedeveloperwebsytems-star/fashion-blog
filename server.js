require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDatabase() {
  try {
    console.log("⏳ Sincronizando catálogo Fashion Dicas...");
    
    // IMPORTANTE: Removi o DROP TABLE para não apagar seus posts do Admin!
    
    // Adicione o DROP antes do CREATE apenas para resetar
      await pool.query(`DROP TABLE IF EXISTS posts;`); 

      await pool.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL UNIQUE, 
          subtitle VARCHAR(255),
          category VARCHAR(50) NOT NULL,
          image_url TEXT,
          content TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          gallery_images TEXT[]
        );
      `);

    // ON CONFLICT (title) DO NOTHING impede que sua lista fixa duplique toda vez
    const insertQuery = `
      INSERT INTO posts (title, subtitle, category, image_url, content, gallery_images) 
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (title) DO NOTHING`; 

    //const colecao = [
        [
            'Vestido de Noiva: O Sonho Sensual', 
            'Realize o sonho do altar com o corte perfeito e um toque de ousadia.', 
            'vestidos', 
            'https://cdn.pixabay.com/photo/2023/02/14/08/53/woman-7789107_1280.jpg', 
            'Seu grande dia merece um vestido que celebre sua feminilidade e sensualidade. Modelos que desenham as curvas, com rendas e transparências estratégicas, elevando a elegância e o desejo.',
            [
                'https://cdn.pixabay.com/photo/2023/02/14/08/53/woman-7789107_1280.jpg',
                'https://cdn.pixabay.com/photo/2023/08/29/10/56/woman-8220964_1280.jpg',
                'https://cdn.pixabay.com/photo/2024/02/02/13/25/woman-8548160_1280.jpg',
                'https://cdn.pixabay.com/photo/2024/02/02/13/26/woman-8548161_1280.jpg'
            ]
        ],
        [
            'Vestido Debutante: A Noite Mágica da Sedução', 
            'Brilhe como uma princesa moderna, com um toque de mistério e glamour.', 
            'vestidos', 
            'https://cdn.pixabay.com/photo/2018/06/30/17/02/model-3508003_1280.jpg', 
            'Para a festa de 15 anos, um vestido que combine a inocência com a emergente sensualidade. Detalhes em pedraria e fendas discretas, valorizando a transição para uma mulher poderosa.',
            [
                'https://cdn.pixabay.com/photo/2018/06/30/17/02/model-3508003_1280.jpg',
                'https://cdn.pixabay.com/photo/2023/10/23/14/35/woman-8336233_1280.jpg',
                'https://cdn.pixabay.com/photo/2023/09/22/08/48/woman-8268523_1280.jpg',
                'https://cdn.pixabay.com/photo/2023/06/04/09/08/woman-8039193_1280.jpg'
            ]
        ],
        [
            'Vestido Verão: Frescor e Sensualidade', 
            'Estilo e conforto para os dias quentes, sem perder o charme provocante.', 
            'vestidos', 
            'https://cdn.pixabay.com/photo/2023/06/03/13/32/woman-8037702_1280.jpg', 
            'Tecidos leves e esvoaçantes que abraçam o corpo, com fendas e decotes que revelam o bronzeado.',
            [
                'https://cdn.pixabay.com/photo/2023/06/03/13/32/woman-8037702_1280.jpg',
                'https://cdn.pixabay.com/photo/2023/06/03/13/48/woman-8037756_1280.jpg',
                'https://cdn.pixabay.com/photo/2022/08/10/15/52/woman-7377507_1280.jpg',
                'https://cdn.pixabay.com/photo/2021/08/31/14/49/act-6589019_1280.jpg'
            ]
        ],
        [
            'Lingerie de Onça: O Poder Animal Print', 
            'Desperte seu lado selvagem e audacioso com um clássico da sedução.', 
            'lingerie', 
            'https://cdn.pixabay.com/photo/2023/12/13/09/50/woman-8446644_1280.jpg', 
            'Um conjunto que exala confiança e paixão. O animal print de onça é atemporal e perfeito para noites onde você quer se sentir irresistível.',
            [
                'https://cdn.pixabay.com/photo/2023/12/13/09/50/woman-8446644_1280.jpg',
                'https://cdn.pixabay.com/photo/2023/12/01/12/43/woman-8423687_1280.jpg',
                'https://cdn.pixabay.com/photo/2023/06/04/09/09/woman-8039197_1280.jpg',
                'https://cdn.pixabay.com/photo/2020/08/25/07/31/woman-5515964_1280.jpg'
            ]
        ],
        [
            'Lingerie de Médica: O Charme do Fetiche', 
            'Explore o mistério e a elegância de um clássico fetiche com um toque de sofisticação.', 
            'lingerie', 
            'https://cdn.pixabay.com/photo/2023/10/25/10/34/woman-8340067_1280.jpg', 
            'A combinação da autoridade com a delicadeza. Conjuntos brancos com detalhes em renda que prometem despertar fantasias.',
            [
                'https://cdn.pixabay.com/photo/2023/10/25/10/34/woman-8340067_1280.jpg',
                'https://cdn.pixabay.com/photo/2023/09/22/08/48/woman-8268525_1280.jpg',
                'https://cdn.pixabay.com/photo/2023/07/10/13/18/woman-8118288_1280.jpg',
                'https://cdn.pixabay.com/photo/2023/10/23/14/37/woman-8336243_1280.jpg'
            ]
        ],
        [
            'Lingerie Transparente: A Arte de Revelar', 
            'Sutileza e mistério em tramas de tule e rendas que convidam ao desejo.', 
            'lingerie', 
            'https://cdn.pixabay.com/photo/2025/01/13/12/48/woman-9330401_1280.jpg', 
            'A transparência valoriza as curvas naturais com um toque artístico e provocante.',
            [
                'https://cdn.pixabay.com/photo/2025/01/13/12/48/woman-9330401_1280.jpg',
                'https://cdn.pixabay.com/photo/2023/10/23/14/34/woman-8336228_1280.jpg',
                'https://cdn.pixabay.com/photo/2023/10/23/14/37/woman-8336243_1280.jpg',
                'https://cdn.pixabay.com/photo/2023/09/06/09/04/woman-8236719_1280.jpg'
            ]
        ],
        [
            'Lingerie Mulher Gato: Ousadia em Couro', 
            'Um visual marcante e misterioso para despertar sua felina interior.', 
            'lingerie', 
            'https://cdn.pixabay.com/photo/2023/08/05/13/06/woman-8171048_1280.jpg', 
            'Inspirada nas vilãs do cinema, esta lingerie em couro exala poder e dominância.',
            [
                'https://cdn.pixabay.com/photo/2023/08/05/13/06/woman-8171048_1280.jpg',
                'https://cdn.pixabay.com/photo/2021/11/03/13/57/girl-6765931_1280.jpg',
                'https://cdn.pixabay.com/photo/2023/09/22/08/47/young-woman-8268520_1280.jpg',
                'https://cdn.pixabay.com/photo/2023/07/10/13/24/woman-8118328_1280.jpg'
            ]
        ],
        [
            'Biquíni Sensual: Curvas em Destaque', 
            'Cortes ousados e tecidos luxuosos para valorizar cada curva do seu corpo.', 
            'biquini', 
            'https://cdn.pixabay.com/photo/2023/06/04/09/11/woman-8039209_1280.jpg', 
            'Desenvolvido para realçar a beleza feminina, com recortes estratégicos que criam uma silhueta harmoniosa.',
            [
                'https://cdn.pixabay.com/photo/2023/06/04/09/11/woman-8039209_1280.jpg',
                'https://cdn.pixabay.com/photo/2023/06/04/09/12/woman-8039211_1280.jpg',
                'https://cdn.pixabay.com/photo/2022/07/25/14/53/boudoir-7343957_1280.jpg',
                'https://cdn.pixabay.com/photo/2020/10/14/18/07/woman-5655051_1280.jpg'
            ]
        ],
        [
            'Biquíni Transparente: O Limite da Sedução', 
            'Inovação em tecidos que brincam com o visual e instigam a imaginação.', 
            'biquini', 
            'https://cdn.pixabay.com/photo/2023/07/10/13/23/woman-8118322_1280.jpg', 
            'Experimente a audácia do biquíni transparente. Feito com materiais que criam a ilusão de recortes flutuantes na pele.',
            [
                'https://cdn.pixabay.com/photo/2023/07/10/13/23/woman-8118322_1280.jpg',
                'https://cdn.pixabay.com/photo/2022/12/13/13/57/summer-7653456_1280.jpg',
                'https://cdn.pixabay.com/photo/2022/12/13/13/57/summer-7653456_1280.jpg',
                'https://cdn.pixabay.com/photo/2022/11/04/10/55/woman-7569550_1280.jpg'
            ]
        ],
        [
            'Biquíni Fio Dental: O Bronze Perfeito', 
            'Liberdade e estilo para o seu momento de sol, com um bronzeado sem marcas.', 
            'biquini', 
            'https://cdn.pixabay.com/photo/2017/10/02/07/05/woman-2808054_1280.jpg', 
            'O clássico das praias brasileiras redesenhado para garantir o bronze perfeito e uma silhueta sexy.',
            [
                'https://cdn.pixabay.com/photo/2017/10/02/07/05/woman-2808054_1280.jpg',
                'https://cdn.pixabay.com/photo/2020/01/28/23/22/lingerie-4801267_1280.jpg',
                'https://cdn.pixabay.com/photo/2023/07/10/13/08/woman-8118260_1280.jpg',
                'https://cdn.pixabay.com/photo/2022/07/25/14/52/woman-7343955_1280.jpg'
            ]
        ]
    ];

    for (let post of colecao) {
      await pool.query(insertQuery, post);
    }
    console.log("✅ Catálogo sincronizado com sucesso!");
    
  } catch (err) { 
    console.error("❌ Erro no Auto-Setup:", err.message); 
  }
}

// Inicializa o banco
initDatabase();

app.use(express.json());
app.use(express.static('public'));

// ROTA 1: BUSCAR POSTS (GET) - ATUALIZADA COM PAGINAÇÃO
app.get('/api/posts', async (req, res) => {
  const { category, offset = 0 } = req.query;
  const limit = 9; // Quantidade de posts por "leva"

  try {
    let result;
    if (category && category !== '') {
      result = await pool.query(
        'SELECT * FROM posts WHERE LOWER(category) = LOWER($1) ORDER BY id DESC LIMIT $2 OFFSET $3',
        [category, limit, offset]
      );
    } else {
      result = await pool.query(
        'SELECT * FROM posts ORDER BY id DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      );
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
});

// ROTA PARA EXCLUIR POST
app.delete('/api/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM posts WHERE id = $1', [id]);
        res.json({ message: 'Post excluído com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao excluir post' });
    }
});

// ROTA PARA ATUALIZAR POST (EDITAR)
app.put('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, subtitle, category, image_url, content, gallery_images } = req.body;
    try {
        const query = `
            UPDATE posts 
            SET title=$1, subtitle=$2, category=$3, image_url=$4, content=$5, gallery_images=$6 
            WHERE id=$7 RETURNING *`;
        const values = [title, subtitle, category, image_url, content, gallery_images, id];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar no banco' });
    }
});

// ROTA 2: SALVAR NOVOS POSTS DO ADMIN (POST)
app.post('/api/posts', async (req, res) => {
    const { title, subtitle, category, image_url, content, gallery_images } = req.body;
    try {
        const query = `
            INSERT INTO posts (title, subtitle, category, image_url, content, gallery_images) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`;
        const values = [title, subtitle, category, image_url, content, gallery_images];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Erro ao inserir post:", err);
        res.status(500).json({ error: 'Erro ao salvar no banco' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor ON: http://localhost:${PORT}`));