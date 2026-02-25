import { Router } from 'itty-router';
import { json, cors } from 'itty-router';

interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  GROQ_API_KEY: string;
  GROQ_API_URL: string;
  GROQ_MODEL: string;
  JWT_SECRET: string;
  ALLOWED_ORIGINS: string;
}

interface ChatRequest {
  message: string;
  userId?: string;
}

interface ChatResponse {
  reply: string;
  model: string;
  timestamp: string;
}

const router = Router();

// CORS middleware
const originMiddleware = (request: Request, env: Env) => {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
  
  return allowedOrigins.includes(origin) || allowedOrigins.includes('*');
};

// Health check endpoint
router.get('/api/health', (request, env: Env) => {
  return json({
    status: 'healthy',
    service: 'OurStory AI Backend',
    timestamp: new Date().toISOString(),
  });
});

// Chat endpoint - Proxy to Groq
router.post('/api/chat', async (request: Request, env: Env) => {
  try {
    // CORS check
    if (!originMiddleware(request, env)) {
      return json({ error: 'CORS not allowed' }, { status: 403 });
    }

    const body = await request.json() as ChatRequest;
    
    if (!body.message || body.message.trim().length === 0) {
      return json({ error: 'Message is required' }, { status: 400 });
    }

    // Call Groq API
    const groqResponse = await fetch(env.GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.GROQ_MODEL,
        messages: [
          {
            role: 'user',
            content: body.message,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      console.error('Groq API error:', groqResponse.status, errorData);

      // Fallback response for development
      return json({
        reply: '🤖 I\'m currently processing your message. Please try again in a moment.',
        model: env.GROQ_MODEL,
        timestamp: new Date().toISOString(),
      } as ChatResponse);
    }

    const groqData = await groqResponse.json() as any;

    // Store chat in D1 (optional)
    if (env.DB && body.userId) {
      try {
        await env.DB.prepare(
          'INSERT INTO chats (user_id, message, response, model, created_at) VALUES (?, ?, ?, ?, ?)'
        ).bind(
          body.userId,
          body.message,
          groqData.choices[0]?.message?.content || 'No response',
          env.GROQ_MODEL,
          new Date().toISOString()
        ).run();
      } catch (dbError) {
        console.error('DB error (non-fatal):', dbError);
      }
    }

    const response: ChatResponse = {
      reply: groqData.choices[0]?.message?.content || 'No response generated',
      model: env.GROQ_MODEL,
      timestamp: new Date().toISOString(),
    };

    return json(response);
  } catch (error) {
    console.error('Chat error:', error);
    return json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
});

// Memory endpoints (optional)
router.get('/api/memories', async (request, env: Env) => {
  try {
    if (!env.DB) {
      return json({ memories: [] });
    }

    const result = await env.DB.prepare(
      'SELECT id, title, content, created_at FROM memories ORDER BY created_at DESC LIMIT 50'
    ).all();

    return json({ memories: result.results || [] });
  } catch (error) {
    console.error('Memories error:', error);
    return json({ memories: [], error: String(error) }, { status: 500 });
  }
});

router.post('/api/memories', async (request: Request, env: Env) => {
  try {
    const body = await request.json() as any;

    if (!body.title || !body.content) {
      return json({ error: 'Title and content required' }, { status: 400 });
    }

    if (!env.DB) {
      return json({ error: 'Database not available' }, { status: 500 });
    }

    const result = await env.DB.prepare(
      'INSERT INTO memories (title, content, created_at) VALUES (?, ?, ?) RETURNING *'
    ).bind(body.title, body.content, new Date().toISOString()).first();

    return json(result, { status: 201 });
  } catch (error) {
    console.error('Create memory error:', error);
    return json({ error: String(error) }, { status: 500 });
  }
});

// 404 handler
router.all('*', () => json({ error: 'Not found' }, { status: 404 }));

// Export handler
export default {
  fetch: router.handle,
};
