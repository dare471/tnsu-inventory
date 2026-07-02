import { PropertyPaneTextField, type IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import type { EmbedOptions } from '../../shared/mechanization-embed';
import { MechanizationBaseWebPart, type MechanizationWebPartProps } from '../../shared/MechanizationBaseWebPart';

export interface IMechanizationListsWebPartProps extends MechanizationWebPartProps {
  description: string;
}

export default class MechanizationListsWebPart extends MechanizationBaseWebPart<IMechanizationListsWebPartProps> {
  protected getContainerId(): string {
    return 'mechanization-lists';
  }

  protected getEmbedOptions(): EmbedOptions {
    return { mode: 'lists' };
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [{
        header: { description: 'Списки: дефектные акты, заявки, входящие' },
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
