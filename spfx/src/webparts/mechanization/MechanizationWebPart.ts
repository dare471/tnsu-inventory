import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { mountMechanizationApp } from '../../frontend/dist-embed/mechanization-mount';

export interface IMechanizationWebPartProps {
  apiBaseUrl: string;
  description: string;
}

export default class MechanizationWebPart extends BaseClientSideWebPart<IMechanizationWebPartProps> {
  private _app: ReturnType<typeof mountMechanizationApp> | undefined;

  public render(): void {
    this.domElement.innerHTML = '<div id="mechanization-app"></div>';
    (window as unknown as { __MECH_API_BASE__: string }).__MECH_API_BASE__ =
      this.properties.apiBaseUrl || '';
    this._app = mountMechanizationApp(this.domElement.querySelector('#mechanization-app')!);
  }

  protected onDispose(): void {
    this._app?.unmount();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [{
        header: { description: 'Настройки API' },
        groups: [{
          groupName: 'Backend',
          groupFields: [
            PropertyPaneTextField('apiBaseUrl', { label: 'URL API (.NET)' }),
            PropertyPaneTextField('description', { label: 'Описание' })
          ]
        }]
      }]
    };
  }
}
