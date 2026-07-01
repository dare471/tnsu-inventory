import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { WebPartContext } from '@microsoft/sp-webpart-base';

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
    const provider = await context.aadTokenProviderFactory.getTokenProvider();
    return provider.getToken(audience);
  };
}

export function setSpfxRuntime(apiBaseUrl: string): void {
  (window as unknown as { __MECH_API_BASE__: string }).__MECH_API_BASE__ =
    apiBaseUrl.replace(/\/$/, '');
}

export abstract class MechanizationBaseWebPart<TProps extends MechanizationWebPartProps>
  extends BaseClientSideWebPart<TProps> {

  protected getToken: (() => Promise<string | null>) | undefined;

  protected async onInit(): Promise<void> {
    setSpfxRuntime(this.properties.apiBaseUrl);
    this.getToken = await createSpfxTokenGetter(this.context, this.properties.apiAudience);
    return super.onInit();
  }

  protected mountRoot(containerId: string): HTMLElement {
    this.domElement.innerHTML = `<div id="${containerId}"></div>`;
    return this.domElement.querySelector(`#${containerId}`)!;
  }
}
