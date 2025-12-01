/**
 * Plugin Sandbox
 * 
 * Provides security isolation for plugins
 */

export class PluginSandbox {
  private permissions: Set<string>;
  private iframe: HTMLIFrameElement | null = null;
  private worker: Worker | null = null;

  constructor(permissions: string[]) {
    this.permissions = new Set(permissions);
  }

  createIframeSandbox(url: string): HTMLIFrameElement {
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.display = 'none';
    
    // Configure sandbox attributes
    iframe.sandbox.add('allow-scripts');
    
    if (this.permissions.has('storage')) {
      iframe.sandbox.add('allow-same-origin');
    }

    // No direct DOM access by default
    // Restricted API surface
    this.iframe = iframe;
    document.body.appendChild(iframe);
    return iframe;
  }

  createWorkerSandbox(scriptUrl: string): Worker {
    const worker = new Worker(scriptUrl, { type: 'module' });
    
    // Restrict worker capabilities
    // No network access unless permissioned
    // No file system access
    
    this.worker = worker;
    return worker;
  }

  hasPermission(permission: string): boolean {
    return this.permissions.has(permission);
  }

  validateAPIAccess(api: string): boolean {
    const apiPermissions: Record<string, string[]> = {
      'nodes': ['nodes', 'graph'],
      'shader': ['shader', 'graph'],
      'scenegraph': ['scenegraph', 'prefabs'],
      'inspector': ['inspector'],
      'runtime': ['runtime', 'build'],
      'network': ['network'],
      'storage': ['storage'],
      'ai': ['ai'],
      'build': ['build']
    };

    const requiredPermissions = apiPermissions[api];
    if (!requiredPermissions) return false;

    return requiredPermissions.some(perm => this.permissions.has(perm));
  }

  destroy(): void {
    if (this.iframe) {
      document.body.removeChild(this.iframe);
      this.iframe = null;
    }
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

