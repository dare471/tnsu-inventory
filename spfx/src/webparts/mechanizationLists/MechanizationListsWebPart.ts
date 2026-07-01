import { PropertyPaneTextField, type IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { mountMechanizationEmbed } from '../../shared/mechanization-embed';
import { MechanizationBaseWebPart, type MechanizationWebPartProps } from '../../shared/MechanizationBaseWebPart';

export interface IMechanizationListsWebPartProps extends MechanizationWebPartProps {
  description: string;
}

export default class MechanizationListsWebPart extends MechanizationBaseWebPart<IMechanizationListsWebPartProps> {
  private _app: Awaited<ReturnType<typeof mountMechanizationEmbed>> | undefined;

  public async render(): Promise<void> {
    const root = this.mountRoot('mechanization-lists');
    this._app?.unmount();
    this._app = await mountMechanizationEmbed(
      root,
      { mode: 'lists' },
      this.getToken
    );
  }

  protected onDispose(): void {
    this._app?.unmount();
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
