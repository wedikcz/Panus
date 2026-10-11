export type VfsNode = {
  id: string;
  parentId: string | null;
  kind: "file" | "directory";
  path: string;
  content?: string;
  mimeType?: string;
  createdAt: number;
  updatedAt: number;
};

export type VfsSnapshot = {
  nodes: Map<string, VfsNode>;
};

const STORE_KEY = "godcore-vfs";

export class VirtualFileSystem {
  private static instance: VirtualFileSystem | null = null;

  private nodes = new Map<string, VfsNode>();
  private readonly rootId = "root";

  public static getInstance(): VirtualFileSystem {
    if (!VirtualFileSystem.instance) {
      VirtualFileSystem.instance = new VirtualFileSystem();
    }
    return VirtualFileSystem.instance;
  }

  private constructor() {
    this.bootstrap();
  }

  public listDirectory(path: string = "/"): VfsNode[] {
    const normalized = this.normalizePath(path);
    const parentId = this.pathToId(normalized);

    return [...this.nodes.values()]
      .filter((node) => node.parentId === parentId)
      .sort((a, b) => a.path.localeCompare(b.path));
  }

  public readFile(path: string): string {
    const node = this.nodes.get(this.pathToId(this.normalizePath(path)));
    if (!node || node.kind !== "file") {
      throw new Error(`File not found: ${path}`);
    }
    return node.content ?? "";
  }

  public writeFile(path: string, content: string, mimeType = "text/plain"): VfsNode {
    const normalized = this.normalizePath(path);
    const id = this.pathToId(normalized);
    const existing = this.nodes.get(id);
    const timestamp = Date.now();

    if (existing && existing.kind !== "file") {
      throw new Error(`Cannot overwrite directory with file: ${path}`);
    }

    const node: VfsNode = {
      id,
      parentId: this.getParentId(normalized),
      kind: "file",
      path: normalized,
      content,
      mimeType,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };

    this.nodes.set(id, node);
    this.persist();
    return node;
  }

  public mkdir(path: string): VfsNode {
    const normalized = this.normalizePath(path);
    const id = this.pathToId(normalized);
    const existing = this.nodes.get(id);

    if (existing && existing.kind !== "directory") {
      throw new Error(`Cannot create directory at file endpoint: ${path}`);
    }

    const node: VfsNode = {
      id,
      parentId: this.getParentId(normalized),
      kind: "directory",
      path: normalized,
      createdAt: existing?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    };

    this.nodes.set(id, node);
    this.persist();
    return node;
  }

  public delete(path: string): void {
    const normalized = this.normalizePath(path);
    const id = this.pathToId(normalized);
    const node = this.nodes.get(id);
    if (!node) {
      return;
    }

    for (const candidate of this.nodes.values()) {
      if (candidate.path.startsWith(normalized + "/")) {
        this.nodes.delete(candidate.id);
      }
    }

    this.nodes.delete(id);
    this.persist();
  }

  public toJSON(): VfsSnapshot {
    return { nodes: new Map(this.nodes) };
  }

  public hydrate(snapshot: VfsSnapshot): void {
    this.nodes = new Map(snapshot.nodes);
    this.persist();
  }

  private bootstrap(): void {
    const rootNode: VfsNode = {
      id: this.rootId,
      parentId: null,
      kind: "directory",
      path: "/",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.nodes.set(this.rootId, rootNode);

    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as VfsSnapshot;
      if (parsed?.nodes instanceof Map) {
        this.nodes = new Map(parsed.nodes);
        return;
      }

      const entries = new Map(Object.entries(parsed.nodes ?? {}));
      this.nodes = new Map(entries) as Map<string, VfsNode>;
    } catch {
      this.nodes = new Map([[this.rootId, rootNode]]);
    }
  }

  private persist(): void {
    if (typeof window === "undefined") {
      return;
    }

    const snapshot = this.toJSON();
    const serializable = {
      nodes: Object.fromEntries(snapshot.nodes.entries()),
    };

    window.localStorage.setItem(STORE_KEY, JSON.stringify(serializable));
  }

  private normalizePath(path: string): string {
    if (!path || path === "/") {
      return "/";
    }

    const normalized = path.replace(/\\/g, "/").replace(/\/+/g, "/").replace(/\/$/, "") || "/";
    return normalized.startsWith("/") ? normalized : `/${normalized}`;
  }

  private pathToId(path: string): string {
    return path === "/" ? this.rootId : path;
  }

  private getParentId(path: string): string | null {
    if (path === "/") {
      return null;
    }

    const parentPath = path.includes("/") ? path.slice(0, path.lastIndexOf("/")) || "/" : "/";
    return this.pathToId(parentPath);
  }
}

export const vfs = VirtualFileSystem.getInstance();
