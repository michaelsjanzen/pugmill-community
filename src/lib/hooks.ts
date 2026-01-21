type HookFn = (data?: any) => any | Promise<any>;

class HookManager {
  private actions: Map<string, HookFn[]> = new Map();
  private filters: Map<string, HookFn[]> = new Map();

  // Actions: Execute side effects (e.g., send an email when a post is published)
  addAction(name: string, fn: HookFn) {
    const hooks = this.actions.get(name) || [];
    this.actions.set(name, [...hooks, fn]);
  }

  async doAction(name: string, data?: any) {
    const hooks = this.actions.get(name) || [];
    for (const hook of hooks) {
      await hook(data);
    }
  }

  // Filters: Modify data (e.g., add a signature to the end of every post)
  addFilter(name: string, fn: HookFn) {
    const hooks = this.filters.get(name) || [];
    this.filters.set(name, [...hooks, fn]);
  }

  async applyFilters(name: string, data: any) {
    let filteredData = data;
    const hooks = this.filters.get(name) || [];
    for (const hook of hooks) {
      filteredData = await hook(filteredData);
    }
    return filteredData;
  }
}

export const hooks = new HookManager();
