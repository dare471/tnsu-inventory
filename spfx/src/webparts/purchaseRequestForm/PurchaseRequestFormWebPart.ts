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
    return { mode: 'purchase-request-form' };
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [{
        header: {
          description: 'Форма заявки. ID заявки — из URL: ?documentId={guid} (или ?id=, ?requestId=).'
        },
        groups: [{
          groupName: 'Backend',
          groupFields: [
            PropertyPaneTextField('apiBaseUrl', { label: 'URL API (.NET)' }),
            PropertyPaneTextField('apiAudience', { label: 'Entra audience (api://...)' }),
            PropertyPaneTextField('description', { label: 'Описание' })
          ]
        }]
      }]
    };
  }
}
