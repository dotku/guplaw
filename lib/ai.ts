import OpenAI from 'openai';
import type { Stream } from 'openai/streaming';
import type {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming,
} from 'openai/resources/chat/completions';

// OpenRouter exposes an OpenAI-compatible API. We reuse the `openai` SDK
// and just swap the base URL + API key.
// https://openrouter.ai/docs/quickstart
export const openai = new OpenAI({
  apiKey: process.env.OPEN_ROUTER_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    // Optional attribution headers surfaced on openrouter.ai rankings.
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'https://gpulaw.com',
    'X-Title': 'GPULaw',
  },
});

// Primary model: Google Gemini (served by Google through OpenRouter).
// Fallback: Llama 3.3 70B served by Cerebras — fast inference, cheap, good
// quality. If Gemini errors or is rate-limited, OpenRouter automatically
// retries the next entry in the `models` array.
export const CHAT_MODEL =
  process.env.OPENROUTER_CHAT_MODEL ?? 'google/gemini-2.5-pro';
export const CHAT_FALLBACK_MODEL =
  process.env.OPENROUTER_CHAT_FALLBACK_MODEL ??
  'meta-llama/llama-3.3-70b-instruct';

export const SUGGESTIONS_MODEL =
  process.env.OPENROUTER_SUGGESTIONS_MODEL ?? 'google/gemini-2.5-flash';
export const SUGGESTIONS_FALLBACK_MODEL =
  process.env.OPENROUTER_SUGGESTIONS_FALLBACK_MODEL ??
  'meta-llama/llama-3.1-8b-instruct';

// OpenRouter-specific routing directives forwarded with every request.
// `models` lists fallback models in priority order; `provider.order` steers
// each model to its preferred upstream (Gemini → Google, Llama → Cerebras).
// Docs: https://openrouter.ai/docs/features/model-routing
//        https://openrouter.ai/docs/features/provider-routing
type OpenRouterExtras = {
  models?: string[];
  provider?: {
    order?: string[];
    allow_fallbacks?: boolean;
  };
};

const PROVIDER_ROUTING: OpenRouterExtras['provider'] = {
  order: ['google-vertex', 'google-ai-studio', 'cerebras'],
  allow_fallbacks: true,
};

/**
 * Wraps `openai.chat.completions.create` to always attach OpenRouter's
 * `models` fallback list + `provider.order` preferences. Overloads preserve
 * the stream vs non-stream return type so call sites stay strongly typed.
 */
export function chatCreate(
  params: ChatCompletionCreateParamsStreaming,
  fallback?: string,
): Promise<Stream<ChatCompletionChunk>>;
export function chatCreate(
  params: ChatCompletionCreateParamsNonStreaming,
  fallback?: string,
): Promise<ChatCompletion>;
export function chatCreate(
  params:
    | ChatCompletionCreateParamsStreaming
    | ChatCompletionCreateParamsNonStreaming,
  fallback: string = CHAT_FALLBACK_MODEL,
): Promise<ChatCompletion | Stream<ChatCompletionChunk>> {
  const withRouting: OpenRouterExtras & typeof params = {
    ...params,
    models: Array.from(new Set([params.model, fallback])),
    provider: PROVIDER_ROUTING,
  };
  // The OpenAI SDK's types don't know about `models` / `provider`, but the
  // HTTP layer forwards them verbatim.
  return openai.chat.completions.create(
    withRouting as ChatCompletionCreateParamsStreaming,
  );
}
