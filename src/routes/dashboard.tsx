export type TaskStatus = "pending" | "running" | "success" | "failed" | "blocked";
export type TaskPriority = "low" | "normal" | "high" | "critical";

export type TaskNode = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dependencies: string[];
  parentId?: string;
  attempts: number;
  result?: string;
  error?: string;
  createdAt: number;
  updatedAt: number;
};

export type Observation = {
  message: string;
  severity: "info" | "warning" | "error" | "success";
};

export class TaskGraphExecutor {
  private static instance: TaskGraphExecutor | null = null;

  private readonly tasks = new Map<string, TaskNode>();

  public static getInstance(): TaskGraphExecutor {
    if (!TaskGraphExecutor.instance) {
      TaskGraphExecutor.instance = new TaskGraphExecutor();
    }
    return TaskGraphExecutor.instance;
  }

  private constructor() {
    // singleton
  }

  public addTask(input: Omit<TaskNode, "id" | "attempts" | "createdAt" | "updatedAt"> & { id?: string }): TaskNode {
    const id = input.id ?? crypto.randomUUID();
    const now = Date.now();
    const task: TaskNode = {
      ...input,
      id,
      attempts: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(id, task);
    return task;
  }

  public getTask(id: string): TaskNode | undefined {
    return this.tasks.get(id);
  }

  public getAllTasks(): TaskNode[] {
    return [...this.tasks.values()].sort((a, b) => b.updatedAt - a.updatedAt);
  }

  public setStatus(id: string, status: TaskStatus): TaskNode | undefined {
    const task = this.tasks.get(id);
    if (!task) {
      return undefined;
    }

    task.status = status;
    task.updatedAt = Date.now();
    return task;
  }

  public markRunning(id: string): TaskNode | undefined {
    return this.setStatus(id, "running");
  }

  public markSuccess(id: string, result: string): TaskNode | undefined {
    const task = this.tasks.get(id);
    if (!task) {
      return undefined;
    }

    task.status = "success";
    task.result = result;
    task.updatedAt = Date.now();
    return task;
  }

  public markFailed(id: string, error: string): TaskNode | undefined {
    const task = this.tasks.get(id);
    if (!task) {
      return undefined;
    }

    task.status = "failed";
    task.error = error;
    task.updatedAt = Date.now();
    return task;
  }

  public enqueueGoal(goal: string): TaskNode[] {
    const root = this.addTask({
      id: `goal-${crypto.randomUUID()}`,
      title: "Primary goal",
      description: goal,
      status: "pending",
      priority: "high",
      dependencies: [],
      attempts: 0,
      result: undefined,
      error: undefined,
    });

    const subTasks = [
      {
        id: `plan-${crypto.randomUUID()}`,
        title: "Plan execution",
        description: "Decompose the goal into actionable work and dependency order.",
        status: "pending",
        priority: "high",
        dependencies: [root.id],
      },
      {
        id: `validate-${crypto.randomUUID()}`,
        title: "Validate outcome",
        description: "Check correctness and ensure the solution is safe and complete.",
        status: "pending",
        priority: "critical",
        dependencies: [root.id],
      },
    ];

    return subTasks.map((task) => this.addTask({ ...task }));
  }

  public observe(taskId: string, message: string, severity: Observation["severity"] = "info"): Observation {
    const task = this.getTask(taskId);
    const observation: Observation = {
      message: `${task?.title ?? "Task"}: ${message}`,
      severity,
    };

    if (task && severity === "error") {
      this.markFailed(taskId, message);
    }

    return observation;
  }

  public runPlanExecuteObserveCorrect(taskId: string): { status: TaskStatus; observations: Observation[] } {
    const task = this.tasks.get(taskId);
    if (!task) {
      return {
        status: "failed",
        observations: [{ message: `Task not found: ${taskId}`, severity: "error" }],
      };
    }

    const observations: Observation[] = [
      { message: `Starting execution for ${task.title}`, severity: "info" },
    ];

    this.markRunning(taskId);

    try {
      const result = `Executed ${task.title} successfully.`;
      this.markSuccess(taskId, result);
      observations.push({ message: result, severity: "success" });
      return { status: "success", observations };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Execution failed";
      this.markFailed(taskId, message);
      observations.push({ message: message, severity: "error" });
      return { status: "failed", observations };
    }
  }
}

export const taskGraphExecutor = TaskGraphExecutor.getInstance();
