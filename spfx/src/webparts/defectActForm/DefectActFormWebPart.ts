import { PropertyPaneTextField, type IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { mountMechanizationEmbed } from '../../shared/mechanization-embed';
import { MechanizationBaseWebPart, type MechanizationWebPartProps } from '../../shared/MechanizationBaseWebPart';

export interface IDefectActFormWebPartProps extends MechanizationWebPartProps {
  description: string;
}

export default class DefectActFormWebPart extends MechanizationBaseWebPart<IDefectActFormWebPartProps> {
  private _app: Awaited<ReturnType<typeof mountMechanizationEmbed>> | undefined;

  public async render(): Promise<void> {
    const root = this.mountRoot('mechanization-defect-act');
    this._app?.unmount();
    this._app = await mountMechanizationEmbed(
      root,
      { mode: 'defect-act-form', documentId: this.properties.documentId?.trim() || undefined },
      this.getToken
    );
  }

  protected onDispose(): void {
    this._app?.unmount();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [{
        header: { description: 'Форма дефектного акта' },
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
