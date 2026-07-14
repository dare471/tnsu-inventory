import { PropertyPaneTextField, type IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import type { EmbedOptions } from '../../shared/mechanization-embed';
import { MechanizationBaseWebPart, type MechanizationWebPartProps } from '../../shared/MechanizationBaseWebPart';

export interface IDefectActFormWebPartProps extends MechanizationWebPartProps {
  description: string;
}

export default class DefectActFormWebPart extends MechanizationBaseWebPart<IDefectActFormWebPartProps> {
  protected getContainerId(): string {
    return 'mechanization-defect-act';
  }

  protected getEmbedOptions(): EmbedOptions {
    return {
      mode: 'defect-act-form',
      documentId: this.properties.documentId?.trim() || undefined
    };
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [{
        header: {
          description: 'Форма дефектного акта. ID — из URL: ?documentId={guid} (или ?DocId=).'
        },
        groups: [{
          groupName: 'Backend',
          groupFields: [
            PropertyPaneTextField('apiBaseUrl', { label: 'URL API (.NET)' }),
            PropertyPaneTextField('apiAudience', { label: 'Entra audience (api://...)' }),
            PropertyPaneTextField('documentId', { label: 'ID документа (пусто = новый)' }),
            PropertyPaneTextField('description', { label: 'Описание' })
          ]
        }]
      }]
    };
  }
}
