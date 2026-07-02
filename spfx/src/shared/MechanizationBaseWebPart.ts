import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { WebPartContext } from '@microsoft/sp-webpart-base';
import { mountMechanizationEmbed, type EmbedOptions } from './mechanization-embed';

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
      return await provider.getToken(audience);
    } catch {
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
  private _app: Awaited<ReturnType<typeof mountMechanizationEmbed>> | undefined;

  protected abstract getContainerId(): string;
  protected abstract getEmbedOptions(): EmbedOptions;

  protected async onInit(): Promise<void> {
    await this.refreshRuntime();
    return super.onInit();
  }

  protected onAfterPropertyPaneChangesApplied(): void {
    void this.refreshRuntime().then(() => this.render());
  }

  protected async refreshRuntime(): Promise<void> {
    setSpfxRuntime(this.properties.apiBaseUrl);
    this.getToken = await createSpfxTokenGetter(this.context, this.properties.apiAudience);
  }

  public async render(): Promise<void> {
    await this.refreshRuntime();

    const containerId = this.getContainerId();
    const root = this.mountRoot(containerId);
    this._app?.unmount();

    try {
      this._app = await mountMechanizationEmbed(
        root,
        this.getEmbedOptions(),
        this.getToken
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      root.innerHTML =
        `<p style="margin:0;padding:12px;color:#b42318;font:14px/1.4 Segoe UI,sans-serif">` +
        `Не удалось загрузить модуль механизации: ${message}</p>`;
    }
  }

  protected onDispose(): void {
    this._app?.unmount();
  }

  protected mountRoot(containerId: string): HTMLElement {
    this.domElement.innerHTML =
      `<div id="${containerId}" style="min-height:480px"></div>`;
    return this.domElement.querySelector(`#${containerId}`)!;
  }
}
