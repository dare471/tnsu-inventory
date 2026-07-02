import { PropertyPaneTextField, type IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import type { EmbedOptions } from '../../shared/mechanization-embed';
import { MechanizationBaseWebPart, type MechanizationWebPartProps } from '../../shared/MechanizationBaseWebPart';

export interface IPurchaseRequestFormWebPartProps extends MechanizationWebPartProps {
  description: string;
}

export default class PurchaseRequestFormWebPart extends MechanizationBaseWebPart<IPurchaseRequestFormWebPartProps> {
  protected getContainerId(): string {
    return 'mechanization-purchase-request';
  }

  protected getEmbedOptions(): EmbedOptions {
    return {
      mode: 'purchase-request-form',
      documentId: this.properties.documentId?.trim() || undefined
    };
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
