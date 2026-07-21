import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { WebPartContext } from '@microsoft/sp-webpart-base';
import { mountMechanizationEmbed, type EmbedOptions } from './mechanization-embed';
import { createSparePartsSearcher, type SearchSparePartsFn } from './sparePartsCatalog';

export type MechanizationWebPartProps = {
  apiBaseUrl: string;
  apiAudience: string;
  documentId?: string;
};

export async function createSpfxTokenGetter(
  context: WebPartContext,
  apiAudience: string
): Promise<() => Promise<string | null>> {
  const audience = apiAudience.trim();
  if (!audience) {
    return async () => null;
  }

  return async () => {
    try {
      const provider = await context.aadTokenProviderFactory.getTokenProvider();
      const token = await provider.getToken(audience);
      if (!token) {
        console.warn('[Mechanization] Entra token is empty for audience', audience);
      }
      return token;
    } catch (err) {
      console.error('[Mechanization] Entra token failed', audience, err);
      return null;
    }
  };
}

export function setSpfxRuntime(apiBaseUrl: string): void {
  (window as unknown as { __MECH_API_BASE__: string }).__MECH_API_BASE__ =
    apiBaseUrl.replace(/\/$/, '');
}

export abstract class MechanizationBaseWebPart<TProps extends MechanizationWebPartProps>
  extends BaseClientSideWebPart<TProps> {

  protected getToken: (() => Promise<string | null>) | undefined;
  private searchSpareParts: SearchSparePartsFn | undefined;
  private _app: Awaited<ReturnType<typeof mountMechanizationEmbed>> | undefined;
  private readonly onViewportResize = (): void => {
    this.applyContainerHeight();
  };

  protected abstract getContainerId(): string;
  protected abstract getEmbedOptions(): EmbedOptions;

  protected async onInit(): Promise<void> {
    await this.refreshRuntime();
    window.addEventListener('resize', this.onViewportResize);
    return super.onInit();
  }

  protected onAfterPropertyPaneChangesApplied(): void {
    void this.refreshRuntime().then(() => this.render());
  }

  protected async refreshRuntime(): Promise<void> {
    setSpfxRuntime(this.properties.apiBaseUrl);
    this.getToken = await createSpfxTokenGetter(this.context, this.properties.apiAudience);
    this.searchSpareParts = createSparePartsSearcher(this.context);
  }

  public async render(): Promise<void> {
    await this.refreshRuntime();

    const containerId = this.getContainerId();
    const root = this.mountRoot(containerId);
    this._app?.unmount();

    const apiBase = (this.properties.apiBaseUrl ?? '').trim();
    const audience = (this.properties.apiAudience ?? '').trim();
    root.innerHTML =
      '<p style="margin:0;padding:12px;color:#475569;font:14px/1.4 Segoe UI,sans-serif">' +
      'Загрузка модуля механизации…</p>';

    if (!apiBase) {
      this.showRootError(root, 'Укажите URL API в свойствах веб-части.');
      return;
    }
    if (!audience) {
      this.showRootError(root, 'Укажите Entra audience (api://...) в свойствах веб-части.');
      return;
    }

    try {
      console.info('[Mechanization] mount', { apiBase, audience, mode: this.getEmbedOptions().mode });
      this._app = await mountMechanizationEmbed(
        root,
        this.getEmbedOptions(),
        this.getToken,
        this.searchSpareParts
      );
      console.info('[Mechanization] mounted');
      requestAnimationFrame(() => this.applyContainerHeight());
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[Mechanization] mount failed', err);
      this.showRootError(root, `Не удалось загрузить модуль: ${message}`);
    }
  }

  private showRootError(root: HTMLElement, message: string): void {
    root.innerHTML =
      `<p style="margin:0;padding:12px;color:#b42318;font:14px/1.4 Segoe UI,sans-serif">${message}</p>`;
  }

  protected onDispose(): void {
    window.removeEventListener('resize', this.onViewportResize);
    this._app?.unmount();
  }

  private applyContainerHeight(): void {
    const top = Math.max(0, Math.round(this.domElement.getBoundingClientRect().top));
    this.domElement.style.width = '100%';
    this.domElement.style.height = `calc(100vh - ${top}px)`;
    this.domElement.style.minHeight = '480px';
    this.domElement.style.overflow = 'hidden';
  }

  protected mountRoot(containerId: string): HTMLElement {
    this.applyContainerHeight();
    this.domElement.innerHTML =
      `<div id="${containerId}" class="mechanization-embed-root"></div>`;
    return this.domElement.querySelector(`#${containerId}`)!;
  }
}
