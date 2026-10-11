export type ModelSpec = {
  id: string;
  name: string;
  family: "Qwen" | "Gemma" | "Llama" | "Phi" | "Mistral";
  tier: "tiny" | "balanced" | "pro";
  preferredFor: string;
  description: string;
  vramaHint: string;
};

export const MODEL_CATALOG: readonly ModelSpec[] = [
  {
    id: "qwen3-coder",
    name: "Qwen3-Coder",
    family: "Qwen",
    tier: "pro",
    preferredFor: "Coder & tool specialist",
    description: "Specialized for code generation, VFS operations, and function calling.",
    vramaHint: "12GB+ VRAM",
  },
  {
    id: "gemma-4",
    name: "Gemma 4",
    family: "Gemma",
    tier: "tiny",
    preferredFor: "On-device efficiency",
    description: "Extremely efficient multimodal model optimized for low-resource devices.",
    vramaHint: "6GB+ VRAM",
  },
  {
    id: "qwen3-thinking",
    name: "Qwen3-Thinking",
    family: "Qwen",
    tier: "pro",
    preferredFor: "Planner & reasoner",
    description: "Deep planning and reflection with a dedicated reasoning mode.",
    vramaHint: "12GB+ VRAM",
  },
  {
    id: "llama-3-3",
    name: "Llama 3.3",
    family: "Llama",
    tier: "balanced",
    preferredFor: "Universal assistant",
    description: "Reliable foundation model for system dialog and general orchestration.",
    vramaHint: "8GB+ VRAM",
  },
  {
    id: "phi-4-mistral-small",
    name: "Phi-4 / Mistral Small",
    family: "Phi",
    tier: "balanced",
    preferredFor: "Security auditor",
    description: "Compact, fast, and suitable for audit checks and intent gating.",
    vramaHint: "7GB+ VRAM",
  },
] as const;

export type InferResult = {
  content: string;
  finishReason?: "stop" | "length" | "error";
};

export type EngineLike = {
  chat: {
    completions: {
      create: (options: {
        messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
        temperature?: number;
        max_tokens?: number;
      }) => Promise<{ choices?: Array<{ message?: { content?: string } }> }>;
    };
  };
};

export class WebLLMManager {
  private static instance: WebLLMManager | null = null;

  private engine: EngineLike | null = null;
  private currentModelId: string = MODEL_CATALOG[0].id;
  private loadPromise: Promise<EngineLike> | null = null;
  private readonly cacheKey = "godcore-webllm-cache";

  public static getInstance(): WebLLMManager {
    if (!WebLLMManager.instance) {
      WebLLMManager.instance = new WebLLMManager();
    }
    return WebLLMManager.instance;
  }

  private constructor() {
    // singleton constructor
  }

  public getCurrentModelId(): string {
    return this.currentModelId;
  }

  public async initialize(): Promise<EngineLike> {
    if (typeof window === "undefined") {
      throw new Error("WebLLM can only initialize in a browser environment.");
    }

    if (this.engine) {
      return this.engine;
    }

    if (!this.loadPromise) {
      this.loadPromise = this.bootstrapEngine();
    }

    this.engine = await this.loadPromise;
    return this.engine;
  }

  public async switchModel(modelId: string): Promise<EngineLike> {
    const exists = MODEL_CATALOG.some((model) => model.id === modelId);
    if (!exists) {
      throw new Error(`Unsupported WebLLM model: ${modelId}`);
    }

    this.currentModelId = modelId;
    this.engine = null;
    this.loadPromise = null;
    return this.initialize();
  }

  public async generate(prompt: string, options: { modelId?: string; temperature?: number; maxTokens?: number } = {}): Promise<InferResult> {
    const engine = await this.initialize();
    const modelId = options.modelId ?? this.currentModelId;
    const response = await engine.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      temperature: options.temperature ?? 0.2,
      max_tokens: options.maxTokens ?? 512,
    });

    const text = response.choices?.[0]?.message?.content ?? "";

    return {
      content: text,
      finishReason: text.length > 0 ? "stop" : "error",
    };
  }

  public getModelCatalog(): readonly ModelSpec[] {
    return MODEL_CATALOG;
  }

  private async bootstrapEngine(): Promise<EngineLike> {
    const { CreateMLCEngine } = await import("@mlc-ai/web-llm");

    const cache = await this.getCacheStorage();
    const engine = await CreateMLCEngine({
      model: this.currentModelId,
      useWebWorker: true,
      cacheStorage: cache,
    });

    return engine as unknown as EngineLike;
  }

  private async getCacheStorage(): Promise<CacheStorage | null> {
    if (typeof window === "undefined" || !("caches" in window)) {
      return null;
    }

    const cacheStorage = await caches.open(this.cacheKey).catch(() => null);
    return cacheStorage ? (cacheStorage as unknown as CacheStorage) : null;
  }
}

export const webllmManager = WebLLMManager.getInstance();
