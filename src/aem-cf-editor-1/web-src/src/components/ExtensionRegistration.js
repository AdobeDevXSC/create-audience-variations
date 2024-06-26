/*
 * <license header>
 */

import { Text } from "@adobe/react-spectrum";
import { register } from "@adobe/uix-guest";
import { extensionId } from "./Constants";

async function ExtensionRegistration() {
  const guestConnection = await register({
    id: extensionId,
    methods: {
      headerMenu: {
        async getButtons() {
          return [
            {
              id: 'create-audience-variations',
              label: 'Create Audience Variations',
              icon: 'OpenIn',
              variant: 'action',
              disabled: 'yes',
              onClick() {
                guestConnection.host.modal.showUrl({
                  title: 'Create Variations from Audiences',
                  url: 'index.html#/audiences',
                  loading: true
                });
              },
            },
          ];
        },
      },
    }
  });

  const init = async () => {
    guestConnection;
  };

  init().catch(console.error);

  return <Text>IFrame for integration with Host (AEM)...</Text>;
}

export default ExtensionRegistration;
