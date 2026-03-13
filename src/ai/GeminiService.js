// ═══════════════════════════════════════════════════════════════
// ARCHON — Gemini API Service
// ═══════════════════════════════════════════════════════════════

export class GeminiService {
  constructor() {
    this.apiKey = localStorage.getItem('archon_gemini_key') || '';
    this.model = 'gemini-1.5-flash';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  }

  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem('archon_gemini_key', key);
  }

  hasKey() {
    return !!this.apiKey;
  }

  async generateProjectContext(description) {
    if (!this.hasKey()) throw new Error('API Key não configurada.');

    const systemInstruction = `
Você é a IA do ARCHON, um engenheiro mecânico e de design avançado.
O usuário vai descrever uma ideia de projeto físico (ex: "um drone agrícola", "um skate elétrico", "uma mesa de escritório").
Sua tarefa é analisar o pedido e gerar a estrutura inicial do projeto em formato JSON estrito.

O JSON DEVE seguir esta estrutura EXATA:
{
  "name": "Nome Curto do Projeto",
  "type": "categoria_simples (ex: drone, carro, mobile, barco. em minusculo)",
  "description": "Descrição técnica e profissional do que o sistema gerou (1 a 2 frases)",
  "specs": {
    "Propriedade 1": "Valor (ex: 15 kg)",
    "Propriedade 2": "Valor (ex: Alumínio)",
    "Qualquer Outra": "Valor"
  },
  "components": [
    {
      "id": "id_unico_sem_espacos",
      "name": "Nome do Componente",
      "type": "tipo (structure, motor, electronics, body, wheel, propeller, comfort, sensor, actuator)",
      "geometry": "geometria (box, cylinder, sphere, torus)",
      "dimensions": { "x": 0.1, "y": 0.1, "z": 0.1 }, // ou radius, height, tube dependendo da geometria. Valores em METROS.
      "position": { "x": 0, "y": 0, "z": 0 },
      "rotation": { "x": 0, "y": 0, "z": 0 }, // Opcional, em radianos
      "material": "material_id (aluminum, steel, titanium, carbon_fiber, abs_plastic, pla_plastic, nylon, wood, glass)",
      "color": "#hexadecimal" // Opcional, sugerido baseado no material/funcao
    }
  ]
}

Regras Críticas para as Dimensões (em metros):
- box: { x, y, z }
- cylinder: { radius, height }
- sphere: { radius }
- torus: { radius, tube }

Posicione os componentes logicamente montando o objeto no espaço 3D, com y=0 sendo o chão.
Gere DE 20 a 40 COMPONENTES EXTREMAMENTE DETALHADOS para o projeto. Este é um software CAD realista: sebre tudo em peças menores (motores, suportes, parafusos principais, eixos, painéis, fios, carenagem, estrutura interna, baterias, sensores). A complexidade do projeto é vital.
Não inclua markdown (não use \`\`\`json). Retorne APENAS o JSON válido.
`;

    const payload = {
      system_instruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [{
        role: "user",
        parts: [{ text: `Gere um projeto estrutural detalhado em JSON para: "${description}"` }]
      }],
      generationConfig: {
        temperature: 0.2, // Low temp for structured JSON
        responseMimeType: "application/json",
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Erro na API do Gemini');
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      
      try {
        const json = JSON.parse(text);
        return json;
      } catch (e) {
        console.error("Gemini returned invalid JSON:", text);
        throw new Error('A IA gerou um formato inválido.');
      }

    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  async sendChatMessage(userMessage, projectContext, chatHistory = []) {
    if (!this.hasKey()) throw new Error('API Key não configurada.');

    const contextStr = projectContext ? JSON.stringify({
      name: projectContext.name,
      components: projectContext.components.map(c => ({ id: c.id, name: c.name, type: c.type, material: c.material, dimensions: c.dimensions }))
    }) : 'Nenhum projeto aberto.';

    const systemInstruction = `
Você é o Engenheiro Chefe de IA da plataforma ARCHON.
O usuário está desenhando um projeto 3D no momento.

Contexto do Projeto Atual:
${contextStr}

Você deve agir de forma natural, amigável e extremamente competente, como o ChatGPT faria, porém focado em CAD/Engenharia.
Você deve responder às dúvidas do usuário, sugerir melhorias de projeto, fornecer dados físicos ou realizar ações.

O usuário pode pedir para você modificar o projeto de verdade. Para isso, sua resposta deve ser EXCLUSIVAMENTE UM JSON com esta estrutura (sem markdown):
{
  "text": "A resposta amigável em linguagem natural que o usuário vai ler (use emojis de engenharia como 🔧, 🚀, 💡, 📊).",
  "suggestions": ["3 a 4 opções curtas do que ele pode te pedir em seguida"],
  "action": null // Ou preencha a action abaixo se necessário
}

Se o usuário pedir para modificar algo, preencha o campo "action":

- ADICIONAR UM COMPONENTE:
"action": { "type": "add_component", "component": { "name": "...", "type": "...", "geometry": "...", "dimensions": {...}, "position": {...}, "material": "..." } }

- REMOVER UM COMPONENTE:
"action": { "type": "remove_component", "componentId": "id_do_componente_no_contexto_acima" }

- MUDAR ESCALA GERAL: (aumentar/diminuir tamanho)
"action": { "type": "scale_all", "factor": 1.2 } (1.2 = +20%, 0.8 = -20%)

Responda APENAS com o objeto JSON.
`;

    // Format history for Gemini
    const contents = chatHistory.map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));
    
    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const payload = {
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Erro na API do Gemini');
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      return JSON.parse(text);
      

    } catch (error) {
      console.error('Gemini Chat Error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
