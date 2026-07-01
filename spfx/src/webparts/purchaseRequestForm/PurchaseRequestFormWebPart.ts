import { PropertyPaneTextField, type IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { mountMechanizationEmbed } from '../../shared/mechanization-embed';
import { MechanizationBaseWebPart, type MechanizationWebPartProps } from '../../shared/MechanizationBaseWebPart';

export interface IPurchaseRequestFormWebPartProps extends MechanizationWebPartProps {
  description: string;
}

export default class PurchaseRequestFormWebPart extends MechanizationBaseWebPart<IPurchaseRequestFormWebPartProps> {
  private _app: Awaited<ReturnType<typeof mountMechanizationEmbed>> | undefined;

  public async render(): Promise<void> {
    const root = this.mountRoot('mechanization-purchase-request');
    this._app?.unmount();
    this._app = await mountMechanizationEmbed(
      root,
      { mode: 'purchase-request-form', documentId: this.properties.documentId?.trim() || undefined },
      this.getToken
    );
  }

  protected onDispose(): void {
    this._app?.unmount();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [{
        header: { description: 'Форма заявки на закупку' },
        groups: [{
          groupName: 'Backend',
          groupFields: [
            PropertyPaneTextField('apiBaseUrl', { label: 'URL API (.NET)' }),
            PropertyPaneTextField('apiAudience', { label: 'Entra audience (api://...)' }),
            PropertyPaneTextField('documentId', { label: 'ID заявки' }),
            PropertyPaneTextField('description', { label: 'Описание' })
          ]
        }]
      }]
    };
  }
}
